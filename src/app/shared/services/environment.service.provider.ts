import { environment } from 'src/environments/environment';
import { EnvironmentService } from './environment.service';

export const EnvironmentServiceFactory = (): EnvironmentService => {
  // Create env instance
  const config = new EnvironmentService();

  // Assign environment variables from environment.ts to EnvironmentService
  Object.assign(config, environment);

  return config;
};

export const EnvironmentServiceProvider = {
  provide: EnvironmentService,
  useFactory: EnvironmentServiceFactory,
  deps: [],
};
