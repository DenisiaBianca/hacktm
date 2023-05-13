export interface IHomeData {
  gasData: IData;
  waterData: IData;
}

export interface IData {
  currentRead: number;
  monthTotal: number;
  dailyUsage: IDailyUsage[];
}

export interface IDailyUsage {
  day: Date;
  value: number;
}
