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

------

**`ubi`**

https://github.com/houseabsolute/precious

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

------

**`delta`**

* https://github.com/dandavison/delta

In your `.gitconfig`:

```toml
[core]
	pager = delta --light
[delta]
    features = unobtrusive-line-numbers decorations
    navigate = true
# more delta config goes here
[interactive]
    diffFilter = delta --color-only --light
```

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

* My replacement for `tidyall`
* Runs many linters and/or tidiers

------

# Thank you
