#!/usr/bin/env -S ags run
import app from "ags/gtk4/app"
import { Astal } from "ags/gtk4"
import { readFile } from "ags/file"

import { Left } from "./widgets/groups/Left"
import { Center } from "./widgets/groups/Center"
import { Right } from "./widgets/groups/Right"

const Bar = (monitor) => {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      class="Bar"
      namespace="bar"
      monitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      marginTop={10}
      marginLeft={20}
      marginRight={20}
    >
      <centerbox>
        <Left $type="start" />
        <Center $type="center" />
        <Right $type="end" />
      </centerbox>
    </window>
  )
}

app.start({
css: readFile("./theme.css") + readFile("./style.css"),
  main() {
    Bar(0)
    Bar(1)
  },
})
