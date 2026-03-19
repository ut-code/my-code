mod __user_main_module__;

fn main() {
    std::env::set_var("RUST_BACKTRACE", "1");
    let default_hook = std::panic::take_hook();
    std::panic::set_hook(Box::new(move |info| {
        eprintln!("#!my_code_panic_hook:");
        // デフォルトのフックを呼び出しpanicメッセージとスタックトレース表示
        default_hook(info);
    }));

    __user_main_module__::main();
}
