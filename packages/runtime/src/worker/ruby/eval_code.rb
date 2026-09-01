require "json"

def __ruby_eval_code(code)
  begin
    result = Kernel.eval(code, TOPLEVEL_BINDING)
    JSON.generate({
      success: true,
      result: result.inspect
    })
  rescue Exception => e
    clean_lines = []
    if e.backtrace
      e.backtrace.each do |line|
        next if line.include?("eval_async") || line.include?("-e:") || line.include?("/bundle/") || line.include?("(eval)") || line.include?("Kernel.eval") || line.include?("__ruby_eval_code")
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

    JSON.generate({
      success: false,
      error_message: formatted_msg,
      is_fatal: false
    })
  end
end
