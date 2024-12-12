type MainTaskId = string | number | symbol;

interface MainTask {
  id: MainTaskId;
  params: Record<string, any> | Array<Record<string, any>>;
};

type MainTaskConfig = {
  interval: number;
}

type MainTaskStatus = "idle" | "running"

type QueueTaskStatus = 'pending' | 'finished' | 'failed'

interface QueueTask extends MainTask {
  status: QueueTaskStatus; // 待处理 | 已完成 | 失败
}

type QueueConfigPosition = 'before' | 'after'; // 队头 | 队尾

interface QueueConfig {
  interval: number;
  position: QueueConfigPosition;
}

type QueueStatus = 'idle' | 'running' | 'termination'; // 空闲 | 运行中 | 终止


