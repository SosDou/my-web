"use client";

import { useEffect, useRef, useState } from "react";

// 进度阶段类型
type ProgressStage =
    | "loading"
    | "reading"
    | "predicting";

// Worker 消息类型
type WorkerMessage =
    | {
        type: "progress";
        stage: ProgressStage;
    }
    | {
        type: "success";
        csv: string;
    }
    | {
        type: "error";
        message: string;
    };

// 进度阶段对应的文本
const PROGRESS_TEXT: Record<ProgressStage, string> = {
    loading: "正在加载离线推理模型……",
    reading: "正在读取 EDF 文件……",
    predicting: "正在运行睡眠阶段推理……",
};

// 最大文件大小限制
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

export function EdfOfflineTool() {

    // Worker 引用
    const workerRef = useRef<Worker | null>(null);

    // 选择的 EDF 文件状态
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // 推理运行状态
    const [isRunning, setIsRunning] = useState(false);

    // 推理进度文本状态
    const [progressText, setProgressText] = useState("");

    // 错误信息状态
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 推理结果 CSV 状态
    const [csvResult, setCsvResult] = useState<string | null>(null);

    useEffect(() => {
        // 初始化离线推理 Worker
        const worker = new Worker("/eeg-to-hypnogram/eeg-inference.worker.js",);

        // 监听 Worker 消息
        worker.onmessage = (
            event: MessageEvent<WorkerMessage>,
        ) => {
            // 处理 Worker 消息
            const message = event.data;

            // 正在加载模型
            if (message.type === "progress") {
                setProgressText(
                    PROGRESS_TEXT[message.stage],
                );
                return;
            }

            // 推理成功完成
            if (message.type === "success") {
                setCsvResult(message.csv);
                setProgressText("分析完成");
                setIsRunning(false);
                return;
            }

            // 推理失败
            if (message.type === "error") {
                setErrorMessage(message.message);
                setProgressText("");
                setIsRunning(false);
            }
        };

        // 监听 Worker 错误
        worker.onerror = (event) => {
            console.error(
                "EEG inference worker error:",
                event,
            );

            setErrorMessage(
                "离线推理 Worker 加载失败",
            );
            setProgressText("");
            setIsRunning(false);
        };

        // 将 Worker 引用存储到 ref 中
        workerRef.current = worker;

        // 清理函数：组件卸载时终止 Worker
        return () => {
            worker.terminate();
            workerRef.current = null;
        };
    }, []);

    // 验证选择的文件是否符合要求
    function validateFile(file: File): string | null {
        if (!file.name.toLowerCase().endsWith(".edf")) {
            return "请选择扩展名为 .edf 的文件。";
        }

        if (file.size <= 0) {
            return "EDF 文件为空。";
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            return "当前版本暂不支持超过 500 MB 的 EDF 文件。";
        }

        return null;
    }

    // 处理文件选择
    function selectFile(file: File) {
        setCsvResult(null);
        setProgressText("");

        const validationError = validateFile(file);
        if (validationError) {
            setSelectedFile(null);
            setErrorMessage(validationError);
            return;
        }

        setSelectedFile(file);
        setErrorMessage(null);
    }

    // 运行推理
    function runPrediction() {
        if (!selectedFile) {
            setErrorMessage("请先选择一个 EDF 文件。");
            return;
        }

        if (!workerRef.current) {
            setErrorMessage(
                "离线推理 Worker 尚未初始化。",
            );
            return;
        }

        setCsvResult(null);
        setErrorMessage(null);
        setProgressText("正在准备分析……");
        setIsRunning(true);

        workerRef.current.postMessage({
            type: "predict",
            file: selectedFile,
        });
    }

    // 下载 CSV 文件
    function downloadCsv() {
        if (!csvResult) {
            return;
        }

        const csvBlob = new Blob(
            [csvResult],
            {
                type: "text/csv;charset=utf-8",
            },
        );

        const downloadUrl = URL.createObjectURL(csvBlob);

        const anchor = document.createElement("a");

        anchor.href = downloadUrl;
        anchor.download = "hypnogram.csv";

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(downloadUrl);
    }

    return (
        // 页面整体区域
        <section className="page-container">
            {/* 页面头部 */}
            <header>
                {/* 页面标题 */}
                <h1 style={{ textAlign: "center" }}>
                    EEG to Hypnogram
                </h1>

                {/* 页面描述 */}
                <p style={{ textAlign: "center" }}>
                    选择一个 EDF 文件，EDF 文件不会上传到服务器，在当前浏览器中完成睡眠阶段推理。
                </p>
            </header>

            {/* EDF 文件选择区域 */}
            <div style={{ textAlign: "center" }}>
                {/* 文件选择表单 */}
                <label>
                    {/* EDF 文件输入框 */}
                    <input
                        type="file"
                        accept=".edf,application/octet-stream"
                        disabled={isRunning}
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                selectFile(file);
                            }
                        }}
                    />
                </label>

                {/* 开始推理按钮 */}
                <button
                    type="button"
                    disabled={
                        !selectedFile || isRunning
                    }
                    onClick={runPrediction}
                >
                    {isRunning
                        ? "正在分析……"
                        : "开始离线推理"}
                </button>
            </div>

            {/* 推理进度提示 */}
            {progressText && (
                <div role="status">
                    <h2 style={{ textAlign: "center" }}>
                        {progressText}
                    </h2>
                </div>
            )}

            {/* 错误信息提示 */}
            {errorMessage && (
                <div role="alert">
                    <h2 style={{ textAlign: "center" }}>
                        {errorMessage}
                    </h2>
                </div>
            )}

            {/* Hypnogram 推理结果 */}
            {csvResult && (
                <section>
                    {/* CSV 下载按钮 */}
                    <button
                        type="button"
                        onClick={downloadCsv}
                        style={{
                            display: "block",
                            marginInline: "auto",
                        }}
                    >
                        下载 Hypnogram CSV
                    </button>


                    {/* CSV 内容预览区域 */}
                    <pre style={{ textAlign: "center" }}>
                        {csvResult}
                    </pre>

                </section>
            )}
        </section>
    );
}
