#!/bin/bash
cd /tmp/lemonde6
claude --permission-mode bypassPermissions --print "$(cat /tmp/lemonde6/prompts/phase1_architecte.txt)" > /tmp/lemonde6/logs/phase1_architecte.log 2>&1
echo "Phase 1 done with exit code: $?" >> /tmp/lemonde6/logs/phase1_architecte.log
openclaw system event --text "Phase 1 Architecte terminee pour lemonde6" --mode now 2>/dev/null || true
