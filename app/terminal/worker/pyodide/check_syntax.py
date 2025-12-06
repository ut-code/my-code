def __check_syntax(code):
    # Python側で実行する構文チェックのコード
    # codeop.compile_commandは、コードが不完全な場合はNoneを返します。

    import codeop

    compiler = codeop.compile_command
    try:
        # compile_commandは、コードが完結していればコンパイルオブジェクトを、
        # 不完全(まだ続きがある)であればNoneを返す
        if compiler(code) is not None:
            return "complete"
        else:
            return "incomplete"
    except (SyntaxError, ValueError, OverflowError):
        # 明らかな構文エラーの場合
        return "invalid"


__check_syntax