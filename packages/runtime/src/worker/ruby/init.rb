$stdout = Object.new.tap do |obj|
  def obj.write(str)
    require "js"
    JS.global[:stdout].write(str)
  end
end
$stderr = Object.new.tap do |obj|
  def obj.write(str)
    require "js"
    JS.global[:stderr].write(str)
  end
end