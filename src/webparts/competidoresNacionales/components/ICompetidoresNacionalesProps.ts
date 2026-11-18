import type {SPHttpClient} from '@microsoft/sp-http'

export interface ICompetidoresNacionalesProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  userDisplayName: string;
  spHttpClient: SPHttpClient;
}
