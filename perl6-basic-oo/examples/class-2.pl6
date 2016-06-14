# sample(main)
class Log {
}

class Log::Loud is Log {
}

my $log = Log::Loud.new;
say $log.isa(Log::Loud);
say $log.isa(Log);
# end-sample
