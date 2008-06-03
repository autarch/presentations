package Spork::Formatter::Extra;
use Spork::Formatter -Base;
use Kwiki::Formatter ();

our $VERSION = '0.01';

sub formatter_classes
{
    return
        ( super(),
          'Html',
          'CSS',
        );
}

sub wafl_classes
{
    return
        ( super(),
          qw( Spork::Formatter::Extra::Html Spork::Formatter::Extra::CSS )
        );
}

const all_phrases => [qw(wafl_phrase asis strong em u tt tt2 hyper titlehyper)];

################################################################################
package Spork::Formatter::Extra::VerbatimBlock;
use base 'Spoon::Formatter::WaflBlock';
sub start_html { '' }
sub end_html { '' }

################################################################################
package Spork::Formatter::Extra::Html;
use base 'Spork::Formatter::Extra::VerbatimBlock';
const wafl_id => 'html';

sub escape_html { $_[0] }

################################################################################
package Spork::Formatter::Extra::CSS;
use base 'Spork::Formatter::Extra::VerbatimBlock';
const wafl_id => 'css';

sub escape_html { return qq|<style type="text/css">$_[0]</style>| }


1;

__END__

=head1 NAME

Spork::Formatter::Extra - The fantastic new Spork::Formatter::Extra!

=head1 SYNOPSIS

Perhaps a little code snippet.

  use Spork::Formatter::Extra;

  my $foo = Spork::Formatter::Extra->new;

=head1 DESCRIPTION

...

=head1 METHODS/FUNCTIONS

...

=head1 AUTHOR

Dave Rolsky, <autarch@urth.org>

=head1 BUGS

Please report any bugs or feature requests to
C<bug-spork-formatter-extra@rt.cpan.org>, or through the web interface at
L<http://rt.cpan.org>.  I will be notified, and then you'll automatically be
notified of progress on your bug as I make changes.

=head1 COPYRIGHT & LICENSE

Copyright 2005 Dave Rolsky, All Rights Reserved.

This program is free software; you can redistribute it and/or modify it
under the same terms as Perl itself.

=cut
