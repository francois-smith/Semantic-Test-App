import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { getVersion } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.setAppTitleWithVersion();
  }

  async checkUpdate(): Promise<void> {
    const update = await check();

    if (update) {
      console.log(
        `found update ${update.version} from ${update.date} with notes ${update.body}`
      );

      let downloaded = 0;
      let contentLength = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength as number;
            console.log(
              `started downloading ${event.data.contentLength} bytes`
            );
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            console.log(`downloaded ${downloaded} from ${contentLength}`);
            break;
          case "Finished":
            console.log("download finished");
            break;
        }
      });

      console.log("update installed");
    }
  }

  async getAppVersion() {
    const appVersion = await getVersion();
    return appVersion;
  }

  async setAppTitleWithVersion() {
    const appVersion = await this.getAppVersion();
    const currentWindow = getCurrentWindow();
    const newTitle = `My Tauri App v${appVersion}`; // Customize the title as needed
    await currentWindow.setTitle(newTitle);
  }
}
