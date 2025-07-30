use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![update_title])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn update_title() {
    let _ = tauri::Builder::default().setup(|app| {
        let app_version = app.package_info().version.to_string();
        let windows = app.webview_windows();

        let window = windows.get("semantic-deployment-app").unwrap();

        window
            .set_title(&format!("Your App Name - v{}", app_version))
            .unwrap();
        Ok(())
    });
}
