def __execfile(filepath):
    # https://stackoverflow.com/questions/436198/what-alternative-is-there-to-execfile-in-python-3-how-to-include-a-python-fil
    with open(filepath, "rb") as file:
        exec_globals = {
            "__file__": filepath,
            "__name__": "__main__",
        }
        exec(compile(file.read(), filepath, "exec"), exec_globals)


__execfile