# Git Down,<br>Make Code

## Dave Rolsky

------

# Git is Simple

------

# Git is Just a Directed Acyclic Graph of Commits

------

## "Git is fundamentally a content-addressable filesystem with a VCS user interface written on top of it"

------

# Questions?

------

# But Seriously ...

------

## Repository

* A set of commits
* And references to those commits
  * A branch is a named reference that moves
  * A tag is a named reference that doesn't move

------

## Commit

* A record of all the files at a point in time
* A pointer to its parent commit(s)
* A SHA1 id

------

## Branch

* A reference to a commit that moves as you commit
* Master is just another branch

------

## Local Versus Remote

* Each repo is a full copy of all the commits
* Repos can be synced with `push` and `fetch`
* Each repo is just a set of commits & refs

------

## Working Directory

* Working directory tracks your current branch
* May contain unstaged changes

------

## Staging Area

* AKA "the index"
* Where things live after `git add`, `rm`, `mv`
* Ready for `git commit`

------

## Merging

* Merges (usually) create a commit with two parents

![](img/merge.svg)

------

## Fast Forward Merge

* Sometimes a merge is a "fast forward" merge

![](img/ff-merge.svg)

------

## Rebase

* Replays your commits to make a fast forward merge

------

![](img/rebase.svg)

------

# Using Git

------

## Fetch vs Pull

* `git fetch` - synchronize local repo with remote
  * Doesn't change your working directory or your local branch

------

## Fetch vs Pull

* `git pull` - synchronize + merge
  * Equivalent to:

```
$> git fetch
$> git merge origin/$branch
```

------

## Fetch vs Pull

* `git pull --rebase` - synchronize + rebase local against remote
  * Equivalent to:

```
$> git fetch
$> git rebase origin/$branch
```

------

## The Stash

* `git stash`
  * Saves all local changes to the "stash"
  * Includes both staging area & working directory
* `git stash pop`
  * Gets the most recent set of changes off the stash
* `git stash list`

------

## `git diff --cached`

* Show staged changes in `diff` form

------

## `git commit --amend`

* Lets you edit the commit message of the most recent commit
* Will also include the contents of the index in the last commit

------

## `git commit -p`

* Interactive partial commit

------

## Commit Refs

* Refs are aliases to commits
* `HEAD` - the most recent commit in the current checkout
* `HEAD~3` - 3 commits back from the current `HEAD`
* `master@{yesterday}` - master

-----

diff --cached
commit -p
commit --amend
rebase -i (HEAD~4)
reset (--hard)
reflog
rerere
