#!/bin/sh

STEP=$((4 - $1))
STEP_PREV=$(($STEP - 1))
/usr/bin/git co -f demo~$STEP
/usr/bin/git reset demo~$STEP_PREV
