import sys
import json
import traceback
import pyodide.code

async def __eval_code(code):
    try:
        result = await pyodide.code.eval_code_async(code, globals())
        return json.dumps({
            "success": True,
            "result": str(result) if result is not None else None,
            "has_return": result is not None,
        })
    except (KeyboardInterrupt, SystemExit, GeneratorExit):
        raise
    except BaseException as e:
        tb = e.__traceback__
        entries = traceback.extract_tb(tb)
        user_entries = [
            entry for entry in entries
            if "_pyodide" not in entry.filename and entry.name != "__eval_code"
        ]

        formatted_lines = ["Traceback (most recent call last):\n"]
        formatted_lines.extend(traceback.format_list(user_entries))
        formatted_lines.extend(traceback.format_exception_only(type(e), e))
        formatted_tb = "".join(formatted_lines).strip()

        return json.dumps({
            "success": False,
            "error_message": formatted_tb,
            "is_fatal": False,
        })


__eval_code
