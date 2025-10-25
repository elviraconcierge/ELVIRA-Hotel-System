import type {
  StaffSchedule,
  ScheduleStatus,
} from "../../../../../../../types/staff-schedules";

export interface ScheduleFormData {
  staffId: string;
  scheduleStartDate: string;
  scheduleFinishDate: string;
  shiftStart: string;
  shiftEnd: string;
  status: ScheduleStatus;
  notes: string;
}

export type ScheduleModalMode = "create" | "edit" | "view";

export interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: StaffSchedule | null;
  mode?: ScheduleModalMode;
  onEdit?: () => void;
  onDelete?: () => void;
  prefilledDate?: Date | null;
}

export interface ScheduleSectionProps {
  mode: ScheduleModalMode;
  formData: ScheduleFormData;
  onFieldChange?: (field: string, value: string) => void;
  errors?: Record<string, string | undefined>;
  disabled?: boolean;
  staffOptions?: Array<{ value: string; label: string }>;
  isLoadingStaff?: boolean;
}
