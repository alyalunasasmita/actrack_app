import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.actrack',
  appName: 'actrack-fe',
  webDir: 'www', 
  //bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, 
      launchAutoHide: true,    
      backgroundColor: "#f6f6f6",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,     
    },
  },
};

export default config;
