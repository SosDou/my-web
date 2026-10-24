/* global createEegInferenceModule */

const ASSET_BASE_PATH = "/eeg-to-hypnogram";

// 部署到 public/eeg-to-hypnogram/ 中的 gzip 压缩模型
const COMPRESSED_MODEL_URL =
    `${ASSET_BASE_PATH}/sleep_rf.srf.gz.bin`;

// WASM 虚拟文件系统中仍然使用原来的 .srf 文件名
const WASM_MODEL_PATH = "/models/sleep_rf.srf";

importScripts(`${ASSET_BASE_PATH}/eeg_inference.js`);

let wasmModulePromise = null;

function pathExists(FS, path) {
    return FS.analyzePath(path).exists;
}

function ensureDirectory(FS, path) {
    if (!pathExists(FS, path)) {
        FS.mkdir(path);
    }
}

function removeFileIfPresent(FS, path) {
    if (pathExists(FS, path)) {
        FS.unlink(path);
    }
}

/**
 * 下载 gzip 压缩模型并在浏览器中解压。
 *
 * 返回值仍然是原始 sleep_rf.srf 的完整字节。
 */
async function downloadAndDecompressModel() {
    const response = await fetch(
        COMPRESSED_MODEL_URL,
        {
            cache: "force-cache",
        },
    );

    if (!response.ok) {
        throw new Error(
            `模型加载失败：HTTP ${response.status}`,
        );
    }

    if (!response.body) {
        throw new Error(
            "模型加载失败：响应中没有可读取的数据流。",
        );
    }

    if (
        typeof DecompressionStream ===
        "undefined"
    ) {
        throw new Error(
            "当前浏览器不支持 gzip 模型解压，请升级浏览器。",
        );
    }

    try {
        const decompressionStream =
            new DecompressionStream("gzip");

        const decompressedStream =
            response.body.pipeThrough(
                decompressionStream,
            );

        const modelBuffer = await new Response(
            decompressedStream,
        ).arrayBuffer();

        if (modelBuffer.byteLength === 0) {
            throw new Error(
                "解压后的模型文件为空。",
            );
        }

        console.log(
            "[EEG Worker] Model decompressed:",
            `${(
                modelBuffer.byteLength /
                1024 /
                1024
            ).toFixed(2)} MiB`,
        );

        return new Uint8Array(modelBuffer);
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? `模型解压失败：${error.message}`
                : "模型解压失败。",
        );
    }
}

async function initializeWasmModule() {
    if (!wasmModulePromise) {
        wasmModulePromise =
            createEegInferenceModule({
                locateFile(path) {
                    return `${ASSET_BASE_PATH}/${path}`;
                },

                print(text) {
                    console.log(
                        "[EEG WASM]",
                        text,
                    );
                },

                printErr(text) {
                    console.error(
                        "[EEG WASM]",
                        text,
                    );
                },
            });
    }

    const wasmModule =
        await wasmModulePromise;

    const { FS } = wasmModule;

    ensureDirectory(FS, "/input");
    ensureDirectory(FS, "/models");
    ensureDirectory(FS, "/output");

    // Worker 生命周期内只下载并解压一次模型。
    if (!pathExists(FS, WASM_MODEL_PATH)) {
        const modelBytes =
            await downloadAndDecompressModel();

        FS.writeFile(
            WASM_MODEL_PATH,
            modelBytes,
        );

        if (!pathExists(FS, WASM_MODEL_PATH)) {
            throw new Error(
                "模型已解压，但无法写入 WASM 虚拟文件系统。",
            );
        }

        console.log(
            "[EEG Worker] Model written to:",
            WASM_MODEL_PATH,
        );
    }

    return wasmModule;
}

self.onmessage = async (event) => {
    if (event.data?.type !== "predict") {
        return;
    }

    const file = event.data.file;

    if (!(file instanceof File)) {
        self.postMessage({
            type: "error",
            message:
                "没有收到有效的 EDF 文件。",
        });
        return;
    }

    const inputPath = "/input/input.edf";
    const outputPath =
        "/output/hypnogram.csv";

    try {
        self.postMessage({
            type: "progress",
            stage: "loading",
        });

        const wasmModule =
            await initializeWasmModule();

        const { FS } = wasmModule;

        removeFileIfPresent(
            FS,
            inputPath,
        );

        removeFileIfPresent(
            FS,
            outputPath,
        );

        self.postMessage({
            type: "progress",
            stage: "reading",
        });

        const edfBuffer =
            await file.arrayBuffer();

        FS.writeFile(
            inputPath,
            new Uint8Array(edfBuffer),
        );

        self.postMessage({
            type: "progress",
            stage: "predicting",
        });

        const exitCode =
            wasmModule.ccall(
                "RunEegPrediction",
                "number",
                [
                    "string",
                    "string",
                    "string",
                ],
                [
                    inputPath,
                    WASM_MODEL_PATH,
                    outputPath,
                ],
            );

        if (exitCode !== 0) {
            const errorMessage =
                wasmModule.ccall(
                    "GetEegPredictionError",
                    "string",
                    [],
                    [],
                );

            throw new Error(
                errorMessage ||
                    `模型推理失败，错误码：${exitCode}`,
            );
        }

        if (!pathExists(FS, outputPath)) {
            throw new Error(
                "推理完成，但没有生成 Hypnogram CSV。",
            );
        }

        const csv = FS.readFile(
            outputPath,
            {
                encoding: "utf8",
            },
        );

        self.postMessage({
            type: "success",
            csv,
        });
    } catch (error) {
        console.error(
            "[EEG Worker] Prediction failed:",
            error,
        );

        self.postMessage({
            type: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "发生未知推理错误。",
        });
    } finally {
        try {
            if (wasmModulePromise) {
                const wasmModule =
                    await wasmModulePromise;

                const { FS } =
                    wasmModule;

                // 删除每次推理产生的临时文件。
                // 不删除模型，以便下一次推理直接复用。
                removeFileIfPresent(
                    FS,
                    inputPath,
                );

                removeFileIfPresent(
                    FS,
                    outputPath,
                );
            }
        } catch (cleanupError) {
            console.warn(
                "[EEG Worker] Cleanup failed:",
                cleanupError,
            );
        }
    }
};