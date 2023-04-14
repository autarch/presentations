# CLI Tools I Use

## Dave Rolsky

------

**`powerline-go`**

https://github.com/justjanne/powerline-go

In my `.bash_profile`:

```sh
PS1="$( powerline-go \
            -theme low-contrast \
            -ignore-repos $HOME \
            -modules time,user,host,ssh,cwd,\
                     perlbrew,perms,git,jobs,root \
            -error $? \
            -newline )"
```

Note:
* A much fancier shell prompt.
* You can configure it to do many different things.
* It _does_ require installing some custom fonts that you must use in your
  terminal for the full fancy look.

------

**`ubi`**

https://github.com/houseabsolute/ubi

Universal Binary Installer

```nohighlight
$> ubi \
       --in ~/.local/bin \
       --project https://github.com/houseabsolute/precious
```

```nohighlight
$> curl --silent --location \
       https://.../bootstrap-ubi.sh |
       TARGET=~/.local/bin sh
```

Also has a Powershell boostrap script.

Note:
* A single-file binary tool I wrote designed to install any single-file binary
  release on GitHub.
* Lots of Go and Rust tools release as a single binary. This lets you easily
  install them from the CLI.

------

**`delta`**

* https://github.com/dandavison/delta

In your `.gitconfig`:

```plaintext
[core]
	pager = delta --light
[delta]
    features = unobtrusive-line-numbers decorations
    navigate = true
# more delta config goes here
[interactive]
    diffFilter = delta --color-only --light
```

Note:
* A pretty, language-aware replacement for diff.

------

**`ripgrep`**

https://github.com/BurntSushi/ripgrep

* `grep` replacement
* Super fast
* Ignores `.git` and friends by default
* Respects `.gitignore`
* Pretty output

------

**`exa`**

https://the.exa.website/

* `ls` replacement
* Great color scheme
* Built-in tree view with `-T`
* `exa --git`

------

**`exa`**

In `.bash_profile`:

```sh
alias ls="exa --color=always"
```

------

**`precious`**

https://github.com/houseabsolute/precious

* **One code quality tool to rule them all**
* Runs many linters and/or tidiers

------

# Thank you
