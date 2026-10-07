import sys
import json
import traceback

def __execfile(filepath):
    HOME = "/home/pyodide"
    try:
        with open(filepath, "rb") as file:
            code_bytes = file.read()

        exec_globals = {
            "__file__": filepath,
            "__name__": "__main__",
        }
        code_obj = compile(code_bytes, filepath, "exec")
        exec(code_obj, exec_globals)
        return json.dumps({"success": True})
    except BaseException as e:
        frames = []
        if isinstance(e, SyntaxError):
            raw_filename = e.filename or filepath
            if raw_filename.startswith(HOME):
                raw_filename = raw_filename[len(HOME):].lstrip("/")
            else:
                raw_filename = raw_filename.lstrip("/")

            frame = {
                "filename": raw_filename,
                "startLineNumber": e.lineno or 1,
                "endLineNumber": e.end_lineno or e.lineno or 1,
            }
            if e.offset is not None:
                frame["startColumn"] = e.offset
            if e.end_offset is not None:
                frame["endColumn"] = e.end_offset
            frames.append(frame)
        else:
            tb = e.__traceback__
            extracted = traceback.extract_tb(tb)
            for entry in reversed(extracted):
                raw_filename = entry.filename
                if raw_filename in ("<exec>", "<string>") or (raw_filename.startswith("<") and raw_filename.endswith(">")):
                    continue
                if raw_filename.startswith(HOME):
                    raw_filename = raw_filename[len(HOME):].lstrip("/")
                else:
                    raw_filename = raw_filename.lstrip("/")

                frame = {
                    "filename": raw_filename,
                    "startLineNumber": entry.lineno,
                    "endLineNumber": entry.end_lineno if entry.end_lineno is not None else entry.lineno,
                }
                if entry.colno is not None:
                    frame["startColumn"] = entry.colno + 1
                if entry.end_colno is not None:
                    frame["endColumn"] = entry.end_colno + 1
                frames.append(frame)

        error_msg_lines = traceback.format_exception_only(type(e), e)
        error_message = "".join(error_msg_lines).strip()

        tb = e.__traceback__
        if tb is not None:
            entries = traceback.extract_tb(tb)
            user_entries = [
                entry for entry in entries
                if entry.name != "__execfile" and not (entry.filename.startswith("<") and entry.filename.endswith(">"))
            ]
            formatted_lines = ["Traceback (most recent call last):\n"]
            formatted_lines.extend(traceback.format_list(user_entries))
            formatted_lines.extend(traceback.format_exception_only(type(e), e))
            formatted_tb = "".join(formatted_lines).strip()
        else:
            formatted_tb = "".join(traceback.format_exception(type(e), e, None)).strip()

        diagnostic = None
        if frames and not isinstance(e, (KeyboardInterrupt, SystemExit)):
            diagnostic = {
                "frames": frames,
                "message": error_message,
                "severity": "error",
            }

        return json.dumps({
            "success": False,
            "error_message": formatted_tb,
            "diagnostic": diagnostic,
            "is_fatal": False,
        })


__execfile