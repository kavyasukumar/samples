#!/bin/bash
bundle exec rake shard_election_results
bundle exec rake import_2017_coverage
bundle exec rake import_providers
