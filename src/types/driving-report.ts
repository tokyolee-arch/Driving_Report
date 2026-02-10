// ============================================
// BV IVI Driving Report - Type Definitions
// ============================================

/** 일별 주행 정보 */
export interface DailyTrip {
  date: string;                  // 'YYYY-MM-DD'
  dayOfWeek: number;             // 0(Mon) ~ 6(Sun)
  from: string;                  // 출발지
  to: string;                    // 목적지
  distance: number;              // km
  duration: number;              // minutes
  avgSpeed: number;              // km/h
  energyEfficiency: number;      // kWh/100km
  energyConsumed: number;        // kWh
  estimatedCost: number;         // won
  ecoScore: number;              // 0~100
  safetyScore: number;           // 0~100
}

/** 이벤트 수치 데이터 */
export interface EventMetricItem {
  label: string;
  value: string | number;
  color?: string;
  sub?: string;
}

/** 속도 변화 그래프 (SVG path 기반) */
export interface SpeedGraphData {
  line: { x: number; y: number }[];
  path: string;                  // SVG path 문자열
  startLabel: string;            // 시작 속도 라벨
  endLabel: string;              // 종료 속도 라벨
}

/** 비교 바 항목 */
export interface ComparisonBarItem {
  label: string;
  value: number;
  max: number;
  color: string;
  displayValue: string;
}

/** 비교 데이터 */
export interface ComparisonData {
  title: string;
  bars: ComparisonBarItem[];
}

/** 주행 이벤트 */
export interface DrivingEvent {
  id: string;
  tripDate: string;              // 'YYYY-MM-DD'
  time: string;                  // 'HH:mm'
  type: 'warn' | 'danger' | 'good' | 'info';
  category: 'accel' | 'brake' | 'speed' | 'eco' | 'complete';
  title: string;
  location: string;
  gps: {
    lat: number;
    lng: number;
    address: string;
  };
  metrics: EventMetricItem[];
  speedGraph?: SpeedGraphData;
  comparison?: ComparisonData;
  impact: string;
  tip: string;
}

/** 주간 메트릭 유형 */
export type WeeklyMetricType =
  | 'distance'
  | 'efficiency'
  | 'consumption'
  | 'eco'
  | 'score';

/** 주간 요약 일별 데이터 */
export interface WeeklyDayData {
  distance: number;
  efficiency: number;
  consumption: number;
  ecoScore: number;
  safetyScore: number;
}

/** 주간 요약 */
export interface WeeklySummary {
  weekStart: string;             // 'YYYY-MM-DD' (월요일)
  days: WeeklyDayData[];         // length: 7 (Mon~Sun)
}

/** 안전 세부항목 */
export interface SafetyDetail {
  category: string;
  score: number;                 // 0~100
  icon: string;
}

/** 소모품 상태 */
export interface ConsumableStatus {
  name: string;
  remainPercent: number;         // 0~100
  detail: string;
  color: string;
}

/** 정비 이력 */
export interface MaintenanceRecord {
  date: string;                  // 'YYYY-MM-DD'
  item: string;
  mileage: number;               // km
  cost: number;                  // won
  icon: string;
}

/** 차량 가치 예상 시세 */
export interface EstimatedValue {
  low: number;
  mid: number;
  high: number;
}

/** 가치 요인 */
export interface ValueFactorItem {
  factor: string;
  impact: string;
}

/** 차량 가치 종합 데이터 */
export interface VehicleValueData {
  trustScore: number;            // 0~100
  totalMileage: number;          // km
  vehicleAge: number;            // years
  accidentCount: number;
  maintenanceRate: number;       // 0~100 %
  batterySOH: number;            // 0~100 %
  avgSafetyScore: number;        // 0~100
  estimatedValue: EstimatedValue;
  valueFactors: ValueFactorItem[];
}

/** 탭 ID */
export type TabId = 'summary' | 'safety' | 'maintenance' | 'value';

/** 탭 설정 */
export interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}
