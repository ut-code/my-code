require "json"

def __ruby_exec_file(filepath)
  begin
    # clear LOADED_FEATURES so that `require` can reload files
    $LOADED_FEATURES.reject! { |f| f =~ %r{\A/[^/]*\.rb\z} }
    load filepath
    JSON.generate({ success: true })
  rescue Exception => e
    frames = []
    if e.backtrace_locations
      e.backtrace_locations.each do |loc|
        path = loc.path
        next if path.nil?
        next if path == "eval" || path == "eval_async" || path.start_with?("eval_async") ||
                path == "-e" || path.start_with?("(eval)") ||
                path.start_with?("bundle/") || path.include?("/bundle/") ||
                (path.start_with?("<") && path.end_with?(">"))

        clean_path = path.sub(%r{\A/+}, "")
        frames << {
          filename: clean_path,
          startLineNumber: loc.lineno,
          endLineNumber: loc.lineno
        }
      end
    end

    clean_lines = []
    if e.backtrace
      e.backtrace.each do |line|
        next if line.include?("eval_async") || line.include?("-e:") || line.include?("/bundle/") || line.include?("(eval)") || line.include?("Kernel#load") || line.include?("__ruby_exec_file")
        clean_lines << line.sub(%r{\A/+}, "")
      end
    end

    if clean_lines.empty?
      formatted_msg = "#{e.message} (#{e.class})"
    else
      first = clean_lines.first
      rest = clean_lines[1..]
      formatted_msg = "#{first}: #{e.message} (#{e.class})"
      if rest && !rest.empty?
        formatted_msg += "\n" + rest.map { |l| "\tfrom #{l}" }.join("\n")
      end
    end

    diagnostic = nil
    if !frames.empty?
      diagnostic = {
        frames: frames,
        message: "#{e.message} (#{e.class})",
        severity: "error"
      }
    end

    JSON.generate({
      success: false,
      error_message: formatted_msg,
      diagnostic: diagnostic,
      is_fatal: false
    })
  end
end
