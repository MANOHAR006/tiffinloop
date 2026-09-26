# TiffinLoop Dropout Tool PRD production version

## Problem
• A home cook drops out with very short notice due to fever, family work, or no show.
• Ops hears late, often only when a hungry customer complains.
• Then ops rushes on chat to find another cook or refund.
• Customers hear nothing until food never comes. Lunch at 12:30 PM is the hard line.

## Who it is for
• Ops team fixing todays food as main user.
• Customers getting the message as second user.
• Company heads seeing repeat dropouts as third user on a separate screen.

## How we measure success
• Share of hurt customers told before food time with goal as all of them.
• Lunch and dinner counted apart.
• Minutes from cook is out to all told with goal under 20 minutes.
• Share covered by backup cook vs refunded with food mismatches noted.
• Repeat dropout counts by city and cook going down over 30 days.

## What the test version proved
• One click shows all hurt people with meal, food type, and phone.
• Backup search keeps same city.
• Food rule is respected where Jain food needs Jain kitchen.
• Daily limit is respected minus already promised plates.
• Lunch gets assigned first.
• A Jain dinner goes to a Jain kitchen with a food type warning.
• A customer with no phone shows as needs visit not sent.
• Every action is written in a log.
• Same food backup is too small for both Bangalore dropouts together so other food or refund path is a must.

## What we left out and why
• One cook at a time because it is quicker to build and test.
• Shared limit still blocks double booking.
• Test messages only because there is no real message vendor in 4 hours.
• Log saved in this browser because it shows the shape while shared log comes later.
• Plain 30 day counts because there are no trend lines yet.
• No cook joining screen because the sheet stays the source.

## Open questions before real build
• Jain rule as hard block or allow with warning.
• Who says yes to other food swap, ops or customer reply.
• Sender name and daily message limit and one phone two names rule.
• Shared log design and how long to keep.
• Daily sheet to app refresh job.
• Handoff to delivery partners for late pickups.
