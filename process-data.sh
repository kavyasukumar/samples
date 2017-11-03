#!/bin/bash
export KINTO_API_TOKEN=YWNhLXVzZXI6cHIxbmdsMw==
# bundle exec rake shard_election_results
bundle exec rake import_2017_coverage
# bundle exec rake import_coverage_history
