namespace :foo do
  def do_stuff(arg)
    puts "Doing all kinds of stuff, like #{arg}!"
  end

  %w[a b c d e f g].each do |x|
    desc "task #{x}"
    task x.to_sym do
      do_stuff x
    end
  end
end
