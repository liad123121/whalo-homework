interface LogsResponseSuccess {
  status: true;
  message: string;
}

interface LogsResponseError {
  status: false;
  error: string | string[];
}

export type LogsResponse = LogsResponseSuccess | LogsResponseError;
