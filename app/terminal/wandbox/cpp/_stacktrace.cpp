#define BOOST_STACKTRACE_USE_ADDR2LINE
#include <boost/stacktrace.hpp>
#include <iostream>
#include <signal.h>
void signal_handler(int signum) {
    signal(signum, SIG_DFL);
    switch(signum) {
    case SIGILL:
        std::cerr << "#!my_code_signal:Illegal instruction" << std::endl;
        break;
    case SIGABRT:
        std::cerr << "#!my_code_signal:Aborted" << std::endl;
        break;
    case SIGBUS:
        std::cerr << "#!my_code_signal:Bus error" << std::endl;
        break;
    case SIGFPE:
        std::cerr << "#!my_code_signal:Floating point exception" << std::endl;
        break;
    case SIGSEGV:
        std::cerr << "#!my_code_signal:Segmentation fault" << std::endl;
        break;
    default:
        std::cerr << "#!my_code_signal:Signal " << signum << " received" << std::endl;
        break;
    }
    std::cerr << "#!my_code_stacktrace:" << std::endl;
    std::cerr << boost::stacktrace::stacktrace();
    raise(signum);
}
struct _init_signal_handler {
    _init_signal_handler() {
        signal(SIGILL, signal_handler);
        signal(SIGABRT, signal_handler);
        signal(SIGBUS, signal_handler);
        signal(SIGFPE, signal_handler);
        signal(SIGSEGV, signal_handler);
    }
} _init_signal_handler_instance;
