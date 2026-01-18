# Sprint Plan: The Perspective Engine

## Overview
This sprint plan breaks down the development of The Perspective Engine into manageable phases with incremental tasks. Each task is designed to be completed independently and tested before moving to the next.

---

## Phase 1: Code Cleanup & Foundation
**Goal:** Remove unnecessary features and prepare codebase for AI integration

### Task 1.1: Remove Arize Phoenix Implementation
- [ ] Remove "Show AI Reasoning" button from `context-sidebar.tsx`
- [ ] Remove `Collapsible` import if no longer needed
- [ ] Remove placeholder AI reasoning trace content
- [ ] Clean up any Arize Phoenix references in comments/docs
- [ ] Test sidebar still displays article information correctly

**Files to modify:**
- `components/sidebar/context-sidebar.tsx`

**Estimated time:** 15 minutes

### Task 1.2: Make Nodes Draggable
- [ ] Update `custom-nodes.tsx` - remove `draggable: false` from all node types (except central node)
- [ ] Update `knowledge-graph.tsx` - ensure React Flow allows node dragging
- [ ] Update `graph-utils.ts` - remove `draggable: false` from subTopic and article node generation (keep central node non-draggable)
- [ ] Test that subTopic and article node types are draggable (central node should remain fixed)
- [ ] Verify edges update correctly when nodes are moved

**Files to modify:**
- `components/graph/custom-nodes.tsx`
- `components/graph/knowledge-graph.tsx`
- `lib/graph-utils.ts`

**Estimated time:** 30 minutes

### Task 1.3: Remove Unconnected Handles & Make Edges Non-Clickable
- [ ] Remove handle circles (connection points) that aren't connected to anything
- [ ] Update `custom-nodes.tsx` to conditionally render handles only where needed
- [ ] Ensure handles are not clickable/interactive
- [ ] Make edges non-clickable in React Flow configuration
- [ ] Test that only nodes are clickable, not edges or unused handles
- [ ] Verify visual cleanup doesn't affect edge connections

**Files to modify:**
- `components/graph/custom-nodes.tsx`
- `components/graph/knowledge-graph.tsx`

**Estimated time:** 30 minutes

### Task 1.4: Add Interactive Node Features
- [ ] Add hover effects to nodes (scale, shadow, border highlight)
- [ ] Add visual feedback when dragging (opacity change, cursor change)
- [ ] Ensure click events still work when nodes are draggable
- [ ] Add smooth transitions for node movements
- [ ] Test interaction doesn't interfere with selection/comparison

**Files to modify:**
- `components/graph/custom-nodes.tsx`
- `components/graph/knowledge-graph.tsx`

**Estimated time:** 30 minutes

---

## Phase 2: API Integration Setup
**Goal:** Set up Gemini 1.5 Flash API integration infrastructure

**Strategy: Hybrid Article Approach**
We're implementing a hybrid approach that combines:
- **Real Articles**: Use Gemini's Google Search grounding to find actual articles related to the topic
- **Generated Articles**: Fallback to generating representative articles if real ones are unavailable
- **Benefits**: Always has content (fallback), but uses real articles when possible for authenticity

### Task 2.1: Environment Configuration
- [ ] Create `.env.local` file with `GEMINI_API_KEY` placeholder
- [ ] Add `.env.local` to `.gitignore`
- [ ] Create `.env.example` with template
- [ ] Set up Next.js API route structure (`app/api/` directory)
- [ ] Install Google Generative AI SDK: `npm install @google/generative-ai`

**Files to create:**
- `.env.local`
- `.env.example`
- `app/api/generate-topic/route.ts` (placeholder)

**Estimated time:** 20 minutes

### Task 2.2: Create Gemini API Route
- [ ] Create `app/api/generate-topic/route.ts`
- [ ] Set up Google Generative AI client initialization
- [ ] Create basic error handling structure
- [ ] Add API key validation
- [ ] Return mock JSON response matching Topic type structure
- [ ] Test route with Postman/curl

**Files to create:**
- `app/api/generate-topic/route.ts`

**Estimated time:** 45 minutes

### Task 2.3: Design Gemini Prompt Template (Hybrid Approach)
- [ ] Create prompt template in `lib/prompts.ts`
- [ ] Define JSON schema for Topic response
- [ ] Implement hybrid approach: real articles + generated fallback
- [ ] Include instructions for:
  - Using Gemini's Google Search grounding to find real articles first
  - Falling back to generating representative articles if real ones unavailable
  - Generating 2-3 relevant sub-topics
  - Finding 3-5 articles per sub-topic with diverse perspectives
  - Extracting real article URLs, titles, and sources when found
  - Classifying political leaning accurately (from real source or generated content)
  - Creating comprehensive summaries from real article content (4-5 bullet points)
  - Extracting key facts from real articles or generating them
- [ ] Add examples of desired output format (with URL field for real articles)
- [ ] Configure prompt to prefer real articles but accept generated ones

**Files to create:**
- `lib/prompts.ts`

**Estimated time:** 1.5 hours

---

## Phase 3: AI Integration Implementation
**Goal:** Connect Gemini API to generate topics dynamically

**Implementation Note:**
The hybrid approach (Task 3.1) will:
1. First attempt to use Gemini's Google Search grounding to find real articles
2. Extract article content, URLs, and metadata from search results
3. Use Gemini to summarize and classify real articles
4. Fall back to generating representative articles if real ones unavailable
5. This ensures the app always works but provides real articles when possible

### Task 3.1: Implement Topic Generation API (Hybrid Approach)
- [ ] Complete `app/api/generate-topic/route.ts` with Gemini integration
- [ ] Use Gemini 1.5 Flash model with Google Search grounding enabled (if available)
- [ ] Implement hybrid article fetching:
  - First: Attempt to use Gemini's Google Search to find real articles
  - Fallback: Generate representative articles if real ones unavailable
- [ ] Handle real article data:
  - Extract URLs from Gemini search results
  - Parse article metadata (title, source, date)
  - Use Gemini to summarize real article content
  - Classify political leaning from real source + content analysis
- [ ] Implement structured output parsing (JSON mode)
- [ ] Add logic to detect if articles are real (have URLs) vs generated
- [ ] Add error handling for API failures (fallback to generation)
- [ ] Add rate limiting considerations
- [ ] Validate response matches Topic type
- [ ] Test with sample queries (both real and generated articles)

**Files to modify:**
- `app/api/generate-topic/route.ts`
- `lib/prompts.ts`

**Estimated time:** 2 hours

### Task 3.2: Create Topic Search Component
- [ ] Create `components/header/topic-search.tsx`
- [ ] Add search input field to header
- [ ] Implement debounced search (500ms delay)
- [ ] Add loading state indicator
- [ ] Add error state handling
- [ ] Integrate with existing `TopicSelector` or replace it
- [ ] Test search triggers API call

**Files to create:**
- `components/header/topic-search.tsx`

**Files to modify:**
- `components/header/app-header.tsx`
- `app/page.tsx`

**Estimated time:** 1 hour

### Task 3.3: Connect Search to Graph
- [ ] Update `app/page.tsx` to handle search results
- [ ] Add state management for loading/error states
- [ ] Call API route when user searches
- [ ] Update `selectedTopic` state with API response
- [ ] Ensure graph re-renders with new topic data
- [ ] Test end-to-end flow: search → API → graph update

**Files to modify:**
- `app/page.tsx`
- `components/graph/knowledge-graph.tsx`

**Estimated time:** 45 minutes

---

## Phase 4: Skeleton Loaders & UX Polish
**Goal:** Improve perceived performance and user experience

### Task 4.1: Create Skeleton Loader Components
- [ ] Create `components/ui/skeleton-node.tsx` for graph nodes
- [ ] Design skeleton structure matching actual nodes (central, subTopic, article)
- [ ] Add shimmer animation effect
- [ ] Create skeleton graph layout (7 nodes as per PRD)
- [ ] Make skeleton nodes non-interactive

**Files to create:**
- `components/ui/skeleton-node.tsx`
- `components/graph/skeleton-graph.tsx`

**Estimated time:** 1 hour

### Task 4.2: Implement Skeleton Loading State
- [ ] Add loading state to `app/page.tsx`
- [ ] Show skeleton graph immediately when search is triggered
- [ ] Replace skeleton with real graph when API responds
- [ ] Ensure smooth transition between states
- [ ] Test loading feels instant (< 3 seconds as per PRD)

**Files to modify:**
- `app/page.tsx`
- `components/graph/knowledge-graph.tsx`

**Estimated time:** 45 minutes

### Task 4.3: Add Loading & Error States
- [ ] Add loading spinner/indicator in header during API call
- [ ] Create error message component for API failures
- [ ] Add retry button on error
- [ ] Show helpful error messages (API key missing, rate limit, etc.)
- [ ] Fallback to demo topics if API fails
- [ ] Test all error scenarios

**Files to create:**
- `components/ui/error-message.tsx`

**Files to modify:**
- `components/header/app-header.tsx`
- `app/page.tsx`

**Estimated time:** 30 minutes

---

## Phase 5: Perspective Analysis Feature
**Goal:** Add detailed perspective analysis to help users understand article classification

### Task 5.1: Design Perspective Analysis Data Structure
- [ ] Define `PerspectiveAnalysis` type in `lib/types.ts`
- [ ] Include fields for:
  - Language patterns analysis (framing indicators, sentiment)
  - Source classification reasoning
  - Topic coverage emphasis points
  - Confidence score for leaning classification
- [ ] Create interface for analysis display

**Files to modify:**
- `lib/types.ts`

**Estimated time:** 30 minutes

### Task 5.2: Generate Perspective Analysis with Gemini
- [ ] Update `lib/prompts.ts` to include perspective analysis generation
- [ ] Add instructions for Gemini to analyze:
  - Why the article received its political leaning classification
  - Specific language patterns that indicate perspective
  - Framing techniques used in the content
  - What aspects of the issue receive emphasis
- [ ] Include analysis in Topic API response generation
- [ ] Test analysis generation with sample articles

**Files to modify:**
- `lib/prompts.ts`
- `app/api/generate-topic/route.ts`

**Estimated time:** 1 hour

### Task 5.3: Add Perspective Analysis Section to Sidebar
- [ ] Create "Perspective Analysis" section in `context-sidebar.tsx`
- [ ] Display analysis breakdown:
  - Source classification reasoning
  - Language pattern indicators
  - Topic coverage emphasis
  - Confidence score
- [ ] Add collapsible/expandable UI for detailed analysis
- [ ] Style to match existing sidebar design
- [ ] Test with real article analysis data

**Files to modify:**
- `components/sidebar/context-sidebar.tsx`
- `lib/types.ts`

**Estimated time:** 1 hour

### Task 5.4: Enhance Analysis with Visual Indicators
- [ ] Add visual breakdown of classification factors
- [ ] Show confidence score with progress bar or visual indicator
- [ ] Highlight specific phrases/examples that influenced classification
- [ ] Add tooltips explaining classification criteria
- [ ] Test visual presentation and readability

**Files to modify:**
- `components/sidebar/context-sidebar.tsx`

**Estimated time:** 45 minutes

---

## Phase 6: Enhanced Interactions & Polish
**Goal:** Refine user interactions and visual polish

### Task 6.1: Improve Node Interactions
- [ ] Add double-click to center/fit view on node
- [ ] Add keyboard shortcuts (Esc to deselect, arrow keys to navigate)
- [ ] Improve drag experience (snap to grid option?)
- [ ] Add node selection highlight animation
- [ ] Ensure compare mode works smoothly with draggable nodes
- [ ] Test all interaction combinations

**Files to modify:**
- `components/graph/knowledge-graph.tsx`
- `components/graph/custom-nodes.tsx`

**Estimated time:** 1 hour

### Task 6.2: Enhance Comparison Feature
- [ ] Improve common ground detection algorithm
- [ ] Add visual indicators on graph when articles are in compare mode
- [ ] Highlight shared facts more prominently
- [ ] Add animation when common ground is found
- [ ] Test with various article combinations

**Files to modify:**
- `components/comparison/comparison-panel.tsx`
- `components/graph/knowledge-graph.tsx`

**Estimated time:** 45 minutes

### Task 6.3: Visual Polish & Animations
- [ ] Add smooth transitions for sidebar open/close
- [ ] Add fade-in animations for graph nodes
- [ ] Improve color contrast for accessibility
- [ ] Add tooltips on hover for article nodes
- [ ] Ensure responsive design works on mobile
- [ ] Test dark/light theme switching

**Files to modify:**
- `components/graph/knowledge-graph.tsx`
- `components/sidebar/context-sidebar.tsx`
- `components/graph/custom-nodes.tsx`
- `app/globals.css`

**Estimated time:** 1 hour

---

## Phase 7: Testing & Optimization
**Goal:** Ensure reliability and performance

### Task 7.1: Performance Optimization
- [ ] Optimize graph rendering (memoization, virtualization if needed)
- [ ] Reduce API response time (optimize prompt, use streaming?)
- [ ] Add response caching for repeated searches
- [ ] Optimize bundle size (check for unused dependencies)
- [ ] Test with large topic graphs (10+ nodes)

**Files to modify:**
- `app/api/generate-topic/route.ts`
- `lib/prompts.ts`
- `components/graph/knowledge-graph.tsx`

**Estimated time:** 1 hour

### Task 7.2: Error Handling & Edge Cases
- [ ] Handle empty search queries
- [ ] Handle API timeout scenarios
- [ ] Handle malformed API responses
- [ ] Handle network failures gracefully
- [ ] Add validation for all user inputs
- [ ] Test with invalid API keys

**Files to modify:**
- `app/api/generate-topic/route.ts`
- `app/page.tsx`
- `components/header/topic-search.tsx`

**Estimated time:** 45 minutes

### Task 7.3: Cross-browser Testing
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test graph interactions on touch devices
- [ ] Verify responsive layout works
- [ ] Fix any browser-specific issues

**Estimated time:** 1 hour

---

## Phase 8: Documentation & Deployment Prep
**Goal:** Prepare for demo and deployment

### Task 8.1: Update Documentation
- [ ] Update README.md with setup instructions
- [ ] Document API key setup process
- [ ] Add architecture overview
- [ ] Document all environment variables
- [ ] Add troubleshooting section

**Files to modify:**
- `README.md`

**Estimated time:** 30 minutes

### Task 8.2: Deployment Configuration
- [ ] Configure Vercel environment variables
- [ ] Set up production API key in Vercel
- [ ] Test deployment on Vercel preview
- [ ] Verify all features work in production
- [ ] Set up custom domain (if needed)

**Estimated time:** 30 minutes

### Task 8.3: Final Demo Preparation
- [ ] Test all three demo topics work correctly
- [ ] Prepare demo script/narrative
- [ ] Record demo video (if needed)
- [ ] Create demo data backup (ensure demo topics always available)
- [ ] Test comparison feature with demo data
- [ ] Verify legal disclaimer is visible

**Estimated time:** 30 minutes

---

## Phase 9: UI Improvements & Polish
**Goal:** Enhance graph visual quality, usability, and branding

### Task 9.1: Make Edges Thicker (DO NOW - UI Change)
**Priority:** Medium (Pure UI change)
- [ ] Update `lib/graph-utils.ts` - change edge `strokeWidth` from 1.5 to 3.0 (double current width)
- [ ] Ensure edges remain visible and well-attached to nodes
- [ ] Test edge thickness looks good at different zoom levels
- [ ] Verify edges stay visually connected to nodes during node dragging/movement
- [ ] Test edge attachment during rapid node movements and animations

**Acceptance Criteria:**
- Edges are double the current thickness (3px instead of 1.5px)
- Edges remain visually attached to nodes at all times during node movement
- No visual disconnection when nodes are dragged
- No visual lag or frames where edges appear detached during node movement
- Edge endpoints stay anchored to node handles without any visual glitches

**Files to modify:**
- `lib/graph-utils.ts`

**Estimated time:** 15 minutes

### Task 9.2: Implement Edge Routing to Handles (DO NOW - Requires Logic)
**Priority:** High (Requires React Flow configuration/logic)
- [ ] Update `lib/graph-utils.ts` - configure edges to connect via handles on all sides of nodes
- [ ] Ensure edges can connect to handles on any side of nodes (top, bottom, left, right)
- [ ] Configure React Flow edge routing to reduce edge crossings and visual tangling
- [ ] Update edge creation logic to allow connection to any side of nodes
- [ ] Test edge routing reduces visual tangling and edge crossings in the graph
- [ ] Verify edges update routing appropriately when nodes are dragged

**Acceptance Criteria:**
- Edges connect via handles positioned on all sides of nodes (top/right/bottom/left)
- Edges can connect to any side of nodes, enabling flexible routing
- Graph looks less tangled with reduced edge crossings
- Edge routing updates smoothly when nodes are moved
- Handle-based routing reduces visual complexity compared to fixed connection points

**Files to modify:**
- `lib/graph-utils.ts`
- `components/graph/knowledge-graph.tsx` (if React Flow config needed)

**Estimated time:** 1 hour

### Task 9.3: Implement Bounded Canvas (DO NOW - Requires Logic)
**Priority:** High (Requires React Flow configuration)
- [ ] Configure React Flow viewport bounds to limit panning and node dragging
- [ ] Implement clamped panning that prevents users from panning into empty infinity space
- [ ] Define a bounding box around the graph content
- [ ] Ensure nodes cannot be dragged outside the bounding region
- [ ] Implement invisible boundary - no visual markers, just movement restrictions
- [ ] Test panning is clamped to the defined bounding box
- [ ] Verify nodes stay within bounds when dragged
- [ ] Ensure users cannot pan/drag nodes beyond the bounded area

**Acceptance Criteria:**
- Panning is clamped to a defined bounding box around the graph content
- Nodes cannot be dragged outside the bounding region
- User cannot pan into empty infinity space
- No infinite scrolling or panning beyond graph boundaries
- Bounds are invisible (no visual markers, just movement restrictions)
- Canvas prevents users from losing the graph view in empty space

**Files to modify:**
- `components/graph/knowledge-graph.tsx`
- `components/graph/skeleton-graph.tsx` (if bounds needed there too)

**Estimated time:** 1 hour

### Task 9.4: Remove Minimap Component (DO NOW - UI Change)
**Priority:** Low (Pure UI change)
- [ ] Remove `<MiniMap>` component from `knowledge-graph.tsx`
- [ ] Remove `<MiniMap>` component from `skeleton-graph.tsx`
- [ ] Remove `MiniMap` import if no longer used
- [ ] Remove minimap-related CSS if any
- [ ] Test graph still functions correctly without minimap

**Acceptance Criteria:**
- Minimap is completely removed from bottom-right corner
- No minimap visible in both loading and loaded graph states
- No errors or unused imports

**Files to modify:**
- `components/graph/knowledge-graph.tsx`
- `components/graph/skeleton-graph.tsx`
- `app/globals.css` (if minimap-specific styles exist)

**Estimated time:** 15 minutes

### Task 9.5: Fix Sidebar Overflow (DO NOW - UI Change)
**Priority:** Medium (Pure UI change)
- [ ] Verify `ScrollArea` component is working correctly in `context-sidebar.tsx`
- [ ] Ensure sidebar content is fully scrollable when it exceeds viewport height
- [ ] Test with long article summaries and perspective analysis sections
- [ ] Verify no content/boxes are cut off at the bottom
- [ ] Ensure sidebar header remains fixed while content scrolls
- [ ] Test with comparison panel as well

**Acceptance Criteria:**
- All sidebar content is accessible via scrolling
- No content is cut off or hidden at the bottom
- Sidebar header (with title/badge) remains visible when scrolling
- Works for both ContextSidebar and ComparisonPanel

**Files to modify:**
- `components/sidebar/context-sidebar.tsx`
- `components/comparison/comparison-panel.tsx` (verify scrolling there too)

**Estimated time:** 30 minutes

### Task 9.6: Fix Zoom Controls & Disclaimer Overlap (DO NOW - UI Change)
**Priority:** Medium (Pure UI change)
- [ ] Check current positioning of React Flow `<Controls>` component (zoom controls)
- [ ] Adjust controls position to avoid overlap with legal disclaimer at bottom
- [ ] Add bottom offset that always clears the disclaimer height
- [ ] Ensure safe-area padding accounts for disclaimer at all screen sizes
- [ ] Test controls are fully visible and clickable across different screen sizes
- [ ] Verify disclaimer doesn't cover zoom controls at any viewport size

**Acceptance Criteria:**
- Zoom controls are fully visible and not cut off by disclaimer
- Controls have a bottom offset that always clears the disclaimer height
- All control buttons are clickable and accessible
- Works correctly across different screen sizes and viewport heights
- No overlap occurs between controls and disclaimer at any screen size

**Files to modify:**
- `components/graph/knowledge-graph.tsx`
- `components/graph/skeleton-graph.tsx`
- `app/globals.css` (if custom positioning needed)

**Estimated time:** 30 minutes

### Task 9.7: Update App Branding Text (DO NOW - UI Change)
**Priority:** Low (Pure UI change)
- [ ] Update app name to "TheBigPicture" (no spaces) in `app-header.tsx`
- [ ] Update tagline to "Where complexity becomes clarity" in `app-header.tsx`
- [ ] Update metadata title in `app/layout.tsx` to "TheBigPicture"
- [ ] Update metadata description in `app/layout.tsx` with new tagline
- [ ] Verify branding appears correctly in header

**Acceptance Criteria:**
- App name displays as "TheBigPicture" (no spaces) in header
- Tagline displays as "Where complexity becomes clarity"
- Browser tab title shows "TheBigPicture"
- All branding text updated consistently

**Files to modify:**
- `components/header/app-header.tsx`
- `app/layout.tsx`

**Estimated time:** 15 minutes

### Task 9.8: Enforce 3-5 Articles Per Node with Clickable Links (DO LATER - Blocked by Gemini Integration)
**Priority:** High (Requires Gemini API changes - PLAN NOW, IMPLEMENT LATER)
**Status:** ⚠️ WAIT to implement until Gemini integration is complete (Phase 3)
- [ ] Update `lib/prompts.ts` - modify prompt to enforce 3-5 articles per sub-topic
- [ ] Add validation in Gemini prompt: "Generate exactly 3-5 articles per sub-topic, no more, no less"
- [ ] Update `app/api/generate-topic/route.ts` - add post-processing validation to ensure 3-5 articles
- [ ] Implement deduplication logic to prevent duplicate articles across sub-topics
- [ ] Add clustering/similarity detection to avoid redundant articles with same perspective
- [ ] If API returns fewer than 3 articles, regenerate or add placeholder logic
- [ ] If API returns more than 5 articles, truncate to 5 (apply deduplication first)
- [ ] Ensure all articles include clickable URLs/links in the data structure
- [ ] Update article node components to support clickable article links
- [ ] Update demo data to match 3-5 articles constraint with clickable links
- [ ] Test article count validation, deduplication, and link functionality

**Acceptance Criteria:**
- Each sub-topic node has exactly 3-5 article nodes connected (no more, no less)
- Gemini prompt explicitly requests 3-5 articles per sub-topic
- API response is validated to ensure 3-5 articles per sub-topic
- Articles are deduplicated across sub-topics to prevent redundancy
- Clustering/similarity detection prevents overload from near-duplicate articles
- All articles have clickable links/URLs that open in new tab/window
- Article nodes or sidebar display clickable article links
- Graph renders correctly with the constrained article count
- Deduplication and clustering work correctly to maintain 3-5 unique articles per sub-topic

**Files to modify:**
- `lib/prompts.ts`
- `app/api/generate-topic/route.ts`
- `lib/demo-data.ts` (update demo data)
- `components/graph/custom-nodes.tsx` (if article links needed on nodes)
- `components/sidebar/context-sidebar.tsx` (ensure article links are clickable)

**Estimated time:** 1.5 hours (includes deduplication and clustering logic)
**Blocked by:** Phase 3 (AI Integration Implementation) must be complete first

---

## Success Criteria Checklist

Based on PRD Section 8, verify:
- [ ] Graph renders 5-7 nodes within 3 seconds of search
- [ ] Sidebar displays detailed bullet points that provide clear understanding
- [ ] Nodes are draggable and interactive
- [ ] No Arize Phoenix references remain
- [ ] Comparison feature finds common ground between perspectives
- [ ] Legal disclaimer is visible
- [ ] Skeleton loaders appear immediately on search
- [ ] All three demo topics work correctly
- [ ] API integration with Gemini works end-to-end

---

## Estimated Total Time: ~22-25 hours (including Phase 9 UI improvements)

## Priority Order
1. **Phase 1** (Cleanup) - Foundation for everything else
2. **Phase 2** (API Setup) - Required before AI integration
3. **Phase 3** (AI Integration) - Core functionality
4. **Phase 9** (UI Improvements) - HIGH PRIORITY: Tasks 9.2 (Edge Routing), 9.3 (Bounded Canvas) should be done early
5. **Phase 4** (Skeleton Loaders) - Critical for UX
6. **Phase 5** (Perspective Analysis) - New feature to explain classifications
7. **Phase 6** (Polish) - Nice to have
8. **Phase 7** (Testing) - Important for reliability
9. **Phase 8** (Deployment) - Final prep

## Phase 9 Task Priority (Within Phase)
**DO NOW (High Priority - Requires Logic/Config):**
- Task 9.2: Edge Routing to Nearest Handle
- Task 9.3: Bounded Canvas

**DO NOW (Medium/Low Priority - Pure UI):**
- Task 9.1: Make Edges Thicker
- Task 9.5: Fix Sidebar Overflow
- Task 9.6: Fix Zoom Controls & Disclaimer Overlap
- Task 9.7: Update App Branding Text
- Task 9.4: Remove Minimap

**DO LATER (Blocked by Gemini Integration):**
- Task 9.8: Enforce 3-5 Articles Per Node (wait until Phase 3 complete)

## Notes
- Each task should be completed and tested before moving to the next
- If a task takes longer than estimated, break it down further
- Keep demo data as fallback throughout development
- Test after each phase completion
- Consider creating feature branches for each phase
