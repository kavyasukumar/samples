#!/bin/bash
export KINTO_API_TOKEN=***REMOVED***
bundle exec rake shard_election_results
bundle exec rake import_2017_coverage
bundle exec rake import_providers
bundle exec rake import_coverage_history
