"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries/types";
import { HypnogramPainter } from "./HypnogramPainter";
import { LuGithub } from "react-icons/lu";

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

// 最大文件大小限制
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

type EdfOfflineToolProps = {
    translations: Dictionary["eegToHypnogram"];
};

export function EdfOfflineTool({ translations }: EdfOfflineToolProps) {

    // 文件输入框引用
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
                    translations.progress[message.stage],
                );
                return;
            }

            // 推理成功完成
            if (message.type === "success") {
                setCsvResult(message.csv);
                setProgressText(translations.progress.completed);
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
                translations.errors.workerLoadFailed,
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
    }, [translations]);

    // 验证选择的文件是否符合要求
    function validateFile(file: File): string | null {
        if (!file.name.toLowerCase().endsWith(".edf")) {
            return translations.errors.invalidExtension;
        }

        if (file.size <= 0) {
            return translations.errors.emptyFile;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            return translations.errors.fileTooLarge;
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
            setErrorMessage(translations.errors.noFileSelected);
            return;
        }

        if (!workerRef.current) {
            setErrorMessage(
                translations.errors.workerNotReady,
            );
            return;
        }

        setCsvResult(null);
        setErrorMessage(null);
        setProgressText(translations.progress.preparing);
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
                    {translations.title}
                </h1>

                {/* 页面描述 */}
                <p style={{ textAlign: "center" }}>
                    {translations.description}
                </p>

                {/* 项目源码仓库 */}
                <p style={{ textAlign: "center" }}>
                    <a
                        href="https://github.com/SosDou/eeg-to-hypnogram"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <LuGithub aria-hidden="true" />
                        {translations.repositoryLink}
                    </a>
                </p>
            </header>

            {/* EDF 文件选择区域 */}
            <div style={{ textAlign: "center" }}>
                {/* 文件选择表单 */}
                {/* EDF 文件输入框由自定义按钮触发，避免使用浏览器固定语言的原生按钮 */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".edf,application/octet-stream"
                    disabled={isRunning}
                    hidden
                    onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                            selectFile(file);
                        }
                    }}
                />

                <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {translations.actions.selectFile}
                </button>

                {selectedFile && <span>{selectedFile.name}</span>}

                <span style={{ margin: "0 10px" }}></span>

                {/* 开始推理按钮 */}
                <button
                    type="button"
                    disabled={
                        !selectedFile || isRunning
                    }
                    onClick={runPrediction}
                >
                    {isRunning
                        ? translations.actions.running
                        : translations.actions.start}
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
                        {translations.actions.download}
                    </button>


                    {/* Hypnogram 图像预览区域 */}
                    <HypnogramPainter
                        csvResult={csvResult}
                        translations={translations.hypnogram}
                    />

                </section>
            )}
        </section>
    );
}
