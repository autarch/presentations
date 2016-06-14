# sample(main)
class Log {
    submethod BUILD ( :$size, :$name ) {
        say "Size = $size";
        say "Name = $name";
    }
}

Log.new( :size(42), :name('foo') );
# end-sample
