export type ReadFileResultType = string | ArrayBuffer | null;

/**
 * `ReadFilePromiseOptions` interface declares all options for the async file read function.
 */
export interface ReadFilePromiseOptions<ResultType extends ReadFileResultType> {
  /**
   * Can pass a predefined file reader.
   */
  fileReader?: FileReader;

  /**
   * Event will be fired when a file has been read successfully.
   * Receives result as an arguments.
   */
  onLoad?(event: ProgressEvent<FileReader>, result: ResultType): void;

  /**
   * Event will be fired when a file read operation has begun.
   */
  onLoadStart?(event: ProgressEvent<FileReader>): void;

  /**
   * Event will be fired when a file read has completed, successfully or not.
   * Receives result as an arguments.
   */
  onLoadEnd?(event: ProgressEvent<FileReader>, result: ResultType): void;

  /**
   * Event will be fired when periodically as the FileReader reads data.
   */
  onProgress?(event: ProgressEvent<FileReader>): void;

  /**
   * Event will be fired when the read failed due to an error.
   * Receives `DOMException` as an arguments.
   */
  onError?(event: ProgressEvent<FileReader>, error: DOMException): void;
}
