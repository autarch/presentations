# Continuous Integration for Perl with Azure Pipelines

## Dave Rolsky

------

## What is Continuous Integration

Note:
* You probably already know this but I'll define it anyway
* Running tests on every commit or push
* Ideally, blocking merge and deploy when tests fail

------

## Azure Pipelines

Note:
* Azure is Microsoft's cloud services offering
* Pipelines is a CI tool that's part of that

------

## Why Azure?

Note:
* Totally free
* Supports the big 3 platforms - Linux, macOS, Windows
* Runs 10 jobs in parallel
* Lots of powerful features including caching, job templates, and more
* I picked it before GitHub Actions did all this stuff too
* May switch to GitHub in the future

------

# `ci-perl-helpers`

------

## The Project

[github.com/autarch/ci-perl-helpers](https://github.com/autarch/ci-perl-helpers/)

* Templates and tools for Perl testing
* Inspired by Graham Knop's [travis-perl/helpers](https://github.com/travis-perl/helpers)

------

## Quick Start

* Create a new "Service Connection"  
  (docs in the project's `README.md`).

------

## Quick Start `azure-pipelines.yml`

```yaml [1-6|5|6]
resources:
  repositories:
    - repository: ci-perl-helpers
      type: github
      name: houseabsolute/ci-perl-helpers
      endpoint: houseabsolute/ci-perl-helpers

...
```

Note:
* `name` is the repo name
* `endpoint` is the service connection name
* These can be different

------

## Quick Start `azure-pipelines.yml`

```yaml[4|5|7|8]
...

stages:
  - template: templates/build.yml@ci-perl-helpers
  - template: templates/linux.yml@ci-perl-helpers
    parameters:
      test_xt: true
      use_default_perls: true
  - template: templates/macos.yml@ci-perl-helpers
    parameters:
      use_default_perls: true
  - template: templates/windows.yml@ci-perl-helpers
    parameters:
      use_default_perls: true
```

------

## Default Perls: Linux

* Latest patch release from 5.8.x to present:
  * 5.8.9
  * 5.10.1
  * 5.12.5
  * 5.14.x, 5.16.x, ...
  * 5.30.3
  * Latest dev release (5.31.11 as of June 14, 2020)
  * blead (most recent commit to perl Git)

Note:
* A test failure with dev or blead does not fail the run, but compilation failure does.
* By default tests are only run with an unthreaded perl.

------

## Default Perls: macOS

* Latest stable release available via [`perlbrew`](https://perlbrew.pl/).

------

## Default Perls: Windows

* Latest stable release available via [`berrybrew`](https://github.com/stevieb9/berrybrew).

------

## Picking Perls

```yaml
from_perl: "5.10"
to_perl: "5.30.0"
include_threads: true
```

```yaml
perls: [ "5.10.0", "5.12.1", "latest" ]
include_threads: true
```

Note:
* Can set just `from_perl` or `to_perl`
* "latest" is the most recent stable release
* Specifying major/minor means "pick the latest patch release for that major/minor"
* You can pick any Perl available via perlbrew (Linux/macOS) or berrybrew (Windows)
* Setting `include_threads` to `true` runs tests with both threaded & unthreaded Perls. Highly recommended for anything with XS.

------

## Coverage Testing

```yaml [5]
  - template: templates/linux.yml@ci-perl-helpers
    parameters:
      test_xt: true
      use_default_perls: true
      coverage: coveralls
```

Note:
* By default uses the most recent Perl version, but you can change that.
* Many options for coverage, including just generating an HTML report and making that available as a CI artifact.
* Can also do coverage testing in multiple partitions for very large/slow test suites. For example Moose.

------

## Extra Perl Prereqs

```yaml [5]
  - template: templates/linux.yml@ci-perl-helpers
    parameters:
      test_xt: true
      use_default_perls: true
      extra_prereqs: [ "Moose", "CGI" ]
```

------

## Extra System Packages: Linux

```yaml [4-6]
  - template: templates/linux.yml@ci-perl-helpers
    parameters:
      use_default_perls: true
      apt:
        - libpng-dev
        - libssl-dev
```

------

## Extra System Packages: macOS

```yaml [4-6]
- template: templates/macos.yml@ci-perl-helpers
    parameters:
      use_default_perls: true
      brew:
        - libpng
        - openssl
```

------

## Extra System Packages: Windows


```yaml [4-6]
  - template: templates/windows.yml@ci-perl-helpers
    parameters:
      use_default_perls: true
      choco:
        - git
        - nodejs
```

------

## Maximum Customization

```yaml
  - template: templates/linux.yml@ci-perl-helpers
    parameters:
      use_default_perls: true
      pre_test_steps:
        - bash: |
            echo "I have the power!"
          displayName: He-man
      post_test_steps:
        - bash: |
            echo "For the honor of Greyskull!"
          displayName: She-ra
```

Note:
* You can put anything Azure supports here.

------

## Execution Flow: Build Stage

* Picks the right one from:
  * `dzil build`
  * `minil dist --no-test`
  * `perl Makefile.PL; make dist`
  * `perl Build.PL; ./Build dist`

------

## Execution Flow: Build Stage

* Always uses a modern Perl
* Install build-time deps
  * ... and caches them
* Publishes the tarball as a pipeline artifact

Note:
* Azure caches are deleted after a certain time period, so you won't always
  get the benefit of the cache.

------

## Execution Flow: Test Stage

* All test jobs run in parallel
* Jobs run in Docker (Linux) or a VM (macOS, Windows)
* Each job installs all relevant deps
  * ... and caches them
* Uploads coverage results if applicable
* Publishes test results to Azure Pipelines

Note:
* Deps installed depend on things like whether the `test_xt` flag is enabled
  for a given job.
* There are some pending improvements to test publishing. Right now it kind of
  sucks.

------

## Execution Flow: More Stuff

* `ci-perl-helpers` tools code has its own perl

Note:
* Separate perl install means missing deps in your project are more likely to
  be caught.


------

## What It Looks Like

* [Recent DateTime.pm test run](https://dev.azure.com/houseabsolute/houseabsolute/_build/results?buildId=1207&view=results)

------

## Speed

* Travis - Linux
  * 33 minutes
* Azure CI - Linux + macOS + Windows
  * 11 minutes
* And don't forget queue time

Note:
* The fewer jobs you can run in parallel the longer runs wait in the queue
  when you push to multiple projects.

------

## Why Is It Faster?

* Travis does not support Docker
  * Installs everything from scratch for each job
* [travis-perl/helpers](https://github.com/travis-perl/helpers) builds distro tarball for every job
* Travis only runs 3 concurrent jobs vs Azure's 10

Note:
* This is not a dig against travis-perl. It was a huge step forward for Perl testing.

------

## Questions So Far?

------

## Azure Pipelines

* [docs home](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
* YAML-based config
* Linux (VM or Docker), macOS, Windows
* Free for public projects with no usage limits!

------

## Should You Use It?

* Future of Azure Pipelines and GitHub CI

Note:
* I'm not sure what the future is for both systems.
* Heard rumors that MS will focus on GitHub in the future.
* GH Actions and Azure Pipelines use the same VMs.
* Share a number of similar concepts.
* Both use YAML but the details are different.

------

## Stages

* A stage contains one or more jobs
  * Stages run in sequence by default
  * Can run stages in parallel

------

## Jobs

* A stage contains 1+ jobs
* Jobs run in parallel by default
* Jobs contain one or more steps
  * Each job can run in a VM or Docker image

------

## Steps

* Jobs contain 1+ steps
* Steps always run in sequence

------

## Conditions

* Stages, jobs, and steps can have conditions
  * "Run this Job if Job X was successful"

------

## Dependencies

* Stages can depend on other stages
* Jobs can depend on other jobs

------

## "Communication" Between Stages

* Publish pipeline artifacts (file or folder)
* Other stages can access them

Note:
* Published artifacts are available forever after the run.
* Can use them to publish builds, for example.

------

## "Communication" Between Jobs and Between Steps

* Pipeline artifacts
* Pipeline variables
  * Set in one step and read in another
* Output pipeline variables
  * Set in one job's step and read in another job
  * Consumer job must depend on producer job


------

<!-- .slide: data-background-image="img/matrix.jpg" data-background-opacity="0.05" -->

## Matrix Jobs

* Define many jobs from a matrix

```yaml
jobs:
  - job: Test
    strategy:
      matrix:
        linux:
          imageName: 'ubuntu-16.04'
        mac:
          imageName: 'macos-10.14'
        windows:
          imageName: 'vs2017-win2016'
    pool:
      vmImage: $(imageName)
    steps:
      - script: ./run-tests
```

Note:
* In practice there's a lot more needed to do multi-platform testing.

------

<!-- .slide: data-auto-animate data-background-image="img/matrix.jpg" data-background-opacity="0.2" -->

## Dynamic Matrix

* Generate the matrix from a step

```yaml
steps:
  - checkout
  - bash: |
      matrix=$( perl ./print-matrix.pl )
      echo
        "##vso[task.setVariable variable=matrix;isOutput=true]$matrix"
```

------

<!-- .slide: data-auto-animate data-background-image="img/matrix.jpg" data-background-opacity="0.3" -->

## Dynamic Matrix

* The `$matrix` is **JSON**!
* Each top-level key is a job to be run
* Each object for that key are the job's variables

```json
{
  "5_10_1": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.10.1-v0.1.6",
    "coverage": "",
    "perl": "5.10.1",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.10.1"
  },
  "5_10_1_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.10.1-threads-v0.1.6",
    "coverage": "",
    "perl": "5.10.1",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.10.1 threads"
  },
  "5_12_5": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.12.5-v0.1.6",
    "coverage": "",
    "perl": "5.12.5",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.12.5"
  },
  "5_12_5_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.12.5-threads-v0.1.6",
    "coverage": "",
    "perl": "5.12.5",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.12.5 threads"
  },
  "5_14_4": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.14.4-v0.1.6",
    "coverage": "",
    "perl": "5.14.4",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.14.4"
  },
  "5_14_4_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.14.4-threads-v0.1.6",
    "coverage": "",
    "perl": "5.14.4",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.14.4 threads"
  },
  "5_16_3": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.16.3-v0.1.6",
    "coverage": "",
    "perl": "5.16.3",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.16.3"
  },
  "5_16_3_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.16.3-threads-v0.1.6",
    "coverage": "",
    "perl": "5.16.3",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.16.3 threads"
  },
  "5_18_4": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.18.4-v0.1.6",
    "coverage": "",
    "perl": "5.18.4",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.18.4"
  },
  "5_18_4_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.18.4-threads-v0.1.6",
    "coverage": "",
    "perl": "5.18.4",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.18.4 threads"
  },
  "5_20_3": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.20.3-v0.1.6",
    "coverage": "",
    "perl": "5.20.3",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.20.3"
  },
  "5_20_3_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.20.3-threads-v0.1.6",
    "coverage": "",
    "perl": "5.20.3",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.20.3 threads"
  },
  "5_22_4": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.22.4-v0.1.6",
    "coverage": "",
    "perl": "5.22.4",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.22.4"
  },
  "5_22_4_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.22.4-threads-v0.1.6",
    "coverage": "",
    "perl": "5.22.4",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.22.4 threads"
  },
  "5_24_4": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.24.4-v0.1.6",
    "coverage": "",
    "perl": "5.24.4",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.24.4"
  },
  "5_24_4_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.24.4-threads-v0.1.6",
    "coverage": "",
    "perl": "5.24.4",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.24.4 threads"
  },
  "5_26_3": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.26.3-v0.1.6",
    "coverage": "",
    "perl": "5.26.3",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.26.3"
  },
  "5_26_3_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.26.3-threads-v0.1.6",
    "coverage": "",
    "perl": "5.26.3",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.26.3 threads"
  },
  "5_28_3": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.28.3-v0.1.6",
    "coverage": "",
    "perl": "5.28.3",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.28.3"
  },
  "5_28_3_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.28.3-threads-v0.1.6",
    "coverage": "",
    "perl": "5.28.3",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.28.3 threads"
  },
  "5_30_3": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.30.3-v0.1.6",
    "coverage": "",
    "perl": "5.30.3",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.30.3"
  },
  "5_30_3_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.30.3-threads-v0.1.6",
    "coverage": "",
    "perl": "5.30.3",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.30.3 threads"
  },
  "5_8_9": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.8.9-v0.1.6",
    "coverage": "",
    "perl": "5.8.9",
    "test_xt": 0,
    "threads": "",
    "title": "Linux 5.8.9"
  },
  "5_8_9_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:5.8.9-threads-v0.1.6",
    "coverage": "",
    "perl": "5.8.9",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux 5.8.9 threads"
  },
  "blead": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:blead-v0.1.6",
    "coverage": "",
    "perl": "blead",
    "test_xt": 0,
    "threads": "",
    "title": "Linux blead"
  },
  "blead_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:blead-threads-v0.1.6",
    "coverage": "",
    "perl": "blead",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux blead threads"
  },
  "dev": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:dev-v0.1.6",
    "coverage": "",
    "perl": "dev",
    "test_xt": 0,
    "threads": "",
    "title": "Linux dev"
  },
  "dev_threads": {
    "allow_failure": 0,
    "container": "houseabsolute/ci-perl-helpers-ubuntu:dev-threads-v0.1.6",
    "coverage": "",
    "perl": "dev",
    "test_xt": 0,
    "threads": 1,
    "title": "Linux dev threads"
  }
}
```

------

## Steps

* Checkout code
* Pre-defined tasks
* Shell
  * Bash on Linux and macOS
  * PowerShell Core on Linux and Windows
  * Bash, cmd, or Powershell on Windows

Note:
* The pipeline's repo is automatically checked out by default.
* You can change or configure that.
* You can check out _other_ repos (defined by Service Connections).
* Huge variety of pre-defined tasks.

------

## Tasks

* Helpers for various tools like Ant, Maven, etc.
* Utilities like "extract files from archive file".
* Packaging - npm, NuGet, Python
* Deployment - Azure, k8s, etc.
* Third party tasks from Visual Studio Marketplace
* Write your own in JS

------

## Templates

* From current project repo or elsewhere
* Define stages, jobs, steps, or variables
* Take parameters
* This is how my `ci-perl-helpers` project works

------

## Lots More Stuff

* Deployment Jobs
  * Tracks deployment history
  * Use different deployment strategies
* Secret variables
* Triggers to define when Pipeline runs
  * For certain branchess
  * On a schedule (cron job!)
* Run local agents
* Parallel jobs for test suite splitting
* Even more but I'm running out of space

Note:
* I use a scheduled trigger to check for new Perl releases and build new Docker images for those releases.

------

## Questions?
