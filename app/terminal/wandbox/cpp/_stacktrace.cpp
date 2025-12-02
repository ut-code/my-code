#define BOOST_STACKTRACE_USE_ADDR2LINE
#include <boost/stacktrace.hpp>
#include <iostream>
#include <signal.h>
void signal_handler(int signum) {
    signal(signum, SIG_DFL);
    switch(signum) {
    case SIGILL:
        std::cerr << "Illegal instruction" << std::endl;
        break;
    case SIGABRT:
        std::cerr << "Aborted" << std::endl;
        break;
    case SIGBUS:
        std::cerr << "Bus error" << std::endl;
        break;
    case SIGFPE:
        std::cerr << "Floating point exception" << std::endl;
        break;
    case SIGSEGV:
        std::cerr << "Segmentation fault" << std::endl;
        break;
    default:
        std::cerr << "Signal " << signum << " received" << std::endl;
        break;
    }
    std::cerr << "Stack trace:" << std::endl;
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
