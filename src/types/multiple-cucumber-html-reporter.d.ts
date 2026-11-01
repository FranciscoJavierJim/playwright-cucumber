declare module 'multiple-cucumber-html-reporter' {
  export interface BrowserMetadata {
    readonly name: string;
    readonly version?: string;
  }

  export interface PlatformMetadata {
    readonly name: string;
    readonly version?: string;
  }

  export interface ReportMetadata {
    readonly browser: BrowserMetadata;
    readonly device: string;
    readonly platform: PlatformMetadata;
  }

  export interface CustomDataItem {
    readonly label: string;
    readonly value: string;
  }

  export interface CustomDataSection {
    readonly title: string;
    readonly data: readonly CustomDataItem[];
  }

  export interface GenerateReportOptions {
    readonly jsonDir: string;
    readonly reportPath: string;
    readonly reportName?: string;
    readonly pageTitle?: string;
    readonly displayDuration?: boolean;
    readonly displayReportTime?: boolean;
    readonly openReportInBrowser?: boolean;
    readonly metadata?: ReportMetadata;
    readonly customData?: CustomDataSection;
  }

  export function generate(options: GenerateReportOptions): void;
}
