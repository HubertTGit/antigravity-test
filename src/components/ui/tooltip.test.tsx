import React from "react"
import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock PointerEvent
class MockPointerEvent extends Event {
  button: number
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
  constructor(type: string, props: PointerEventInit) {
    super(type, props)
    this.button = props.button || 0
    this.ctrlKey = props.ctrlKey || false
    this.metaKey = props.metaKey || false
    this.shiftKey = props.shiftKey || false
    this.altKey = props.altKey || false
  }
}
global.PointerEvent = MockPointerEvent as any
global.HTMLElement.prototype.scrollIntoView = jest.fn()
global.HTMLElement.prototype.releasePointerCapture = jest.fn()
global.HTMLElement.prototype.hasPointerCapture = jest.fn()

describe("Tooltip Component", () => {
  it("renders tooltip trigger", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    expect(screen.getByText("Hover me")).toBeInTheDocument()
  })

  it("shows tooltip content on hover", async () => {
    const user = userEvent.setup()
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    const trigger = screen.getByText("Hover me")
    await user.hover(trigger)

    await waitFor(() => {
      const tooltips = screen.getAllByText("Tooltip content")
      expect(tooltips.length).toBeGreaterThan(0)
    })
  })

  it("shows tooltip content on focus", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Focus me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    const trigger = screen.getByText("Focus me")
    act(() => {
      trigger.focus()
    })

    await waitFor(() => {
      const tooltips = screen.getAllByText("Tooltip content")
      expect(tooltips.length).toBeGreaterThan(0)
    })
  })
})
