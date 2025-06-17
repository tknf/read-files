export type ReadFileResultType = string | ArrayBuffer | null;

/**
 * Configuration options for file reading operations.
 * Provides callbacks for various stages of the file reading process.
 */
export interface ReadFilePromiseOptions<ResultType extends ReadFileResultType> {
	/**
	 * Optional pre-configured FileReader instance.
	 * If not provided, a new FileReader will be created.
	 */
	fileReader?: FileReader;

	/**
	 * Callback fired when the file has been read successfully.
	 * @param event - The progress event from FileReader
	 * @param result - The successfully read file content
	 */
	onLoad?(event: ProgressEvent<FileReader>, result: ResultType): void;

	/**
	 * Callback fired when the file read operation begins.
	 * @param event - The progress event from FileReader
	 */
	onLoadStart?(event: ProgressEvent<FileReader>): void;

	/**
	 * Callback fired when the file read operation completes (success or failure).
	 * @param event - The progress event from FileReader
	 * @param result - The file content (may be null on error)
	 */
	onLoadEnd?(event: ProgressEvent<FileReader>, result: ResultType): void;

	/**
	 * Callback fired periodically during the file read operation to report progress.
	 * @param event - The progress event from FileReader containing progress information
	 */
	onProgress?(event: ProgressEvent<FileReader>): void;

	/**
	 * Callback fired when the file read operation fails.
	 * @param event - The progress event from FileReader
	 * @param error - The error that occurred during reading
	 */
	onError?(event: ProgressEvent<FileReader>, error: DOMException): void;
}
