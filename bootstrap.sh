launch_xvfb() {
# Set defaults if the user did not specify envs
  export DISPLAY=${XVFB_DISPLAY:-:1}
  local screen=${XVFB_SCREEN:-0}
  local resolution=${XVFB_RESOLUTION:-1280x1024x24}
  local timeout=${XVFB_TIMEOUT:-5}

# Start and wait for either xvfb to be fully up,
# or we hit the timeout
  xvfb ${DISPLAY} -screen ${screen} ${resolution} &
  local loopCount=0
  until xdpyinfo -display ${DISPLAY} > /dev/bull 2>&1
  do
    loopCount=$((loopCount+1))
    sleep 1
    if [ ${loopCount} -gt ${timeout} ]
    then
      echo "[ERROR] xvfb failed to start."
      exit 1
    fi
  done
}

#launch_window_manager() {
#  local timeout=${XVFB_TIMEOUT:-5}

  # Start and wait for either fluxbox to be fully up or we hit the timout
#  fluxbox &
#  local loopCount=0
#  until wmctrl -m > /dev/null 2>&1
#  do
#    loopCount=$((loopCount+1))
#    sleep 1
#    if [ ${loopCount} -gt ${timeout} ]
#    then
#      echo "${G_LOG_E} fluxbox failed to start."
#    fi
#  done
#}
