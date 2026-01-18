# PRD.md

## Project Name: The Perspective Engine

**Tagline:** Mapping the world’s complexity to foster media literacy and reduce polarization.

---

### 1. Project Overview & Goal

The Perspective Engine is an interactive educational tool designed for students and self-learners to navigate complex, polarized topics. Instead of a flat list of links, it provides a **Dynamic Node Graph** that visualizes the relationship between sub-topics and diverse news perspectives. The goal is to provide a single-feature tool that allows users to understand the "whole board" of a conflict without information overload or algorithmic bias.

### 2. Targeted NexHacks Tracks

* 
**Education (General Track):** Improves learning outcomes by making complex global events accessible and engaging for students.

---

### 3. User Problem & Solution

* **The Problem:** Students face cognitive fatigue from news abundance and algorithmic polarization that traps them in ideological bubbles.
* **The Solution:** A visual knowledge map that color-codes sources on a 5-point political spectrum and provides detailed bulleted summaries focusing on core arguments.

---

### 4. Technical Stack

* **Frontend:** React (Next.js) with Tailwind CSS.
* **Graph Library:** `react-flow` for interactive, clickable nodes.
* **LLM Engine:** Gemini 1.5 Flash (for high-speed research and summarization).


* **Deployment:** Vercel (Frontend) and Cursor (Development).

---

### 5. Functional Requirements

#### 5.1. Interactive Knowledge Graph

* **Central Node:** Displays the user's search term (Largest size).
* **Sub-Topic Nodes:** AI-generated categories related to the term (Medium size).
* **Article Nodes:** Specific news sources branching from sub-topics (Smallest size).
* **Interaction:** Nodes are static and not draggable to maintain an organized visual structure. Clicking an article node triggers the Context Sidebar.

#### 5.2. 5-Point Political Spectrum

Article nodes are color-coded based on the following scale:

* **Blue:** Left
* **Light Blue:** Lean-Left
* **Purple:** Center
* **Light Red:** Lean-Right
* **Red:** Right
* **Grey:** Neutral/Data-Driven (Facts-only)

#### 5.3. Context Sidebar (The "Gist")

* **Headline & Badge:** Displays article title and its leaning badge.
* **Comprehensive Bullet Points:** A summary provided in bulleted format. These should be long enough to give a full understanding of the article's core arguments and perspective. Avoid extreme brevity; ensure the user gets the full gist of the content in a readable way.
* 


#### 5.4. The "Aha!" Moment

* **Feature:** If a user selects a Left node and a Right node, the UI highlights shared facts or overlapping data points between the two perspectives.
* **Goal:** To visually demonstrate common ground in polarized debates.

#### 5.5. Legal Disclaimer

* **Placement:** Fixed footer or sidebar bottom.
* **Text:** AI-generated summaries for educational use only. Always verify critical information through original sources.

---

### 6. Data Strategy & Demo Prep

To ensure a successful demo during the 10-hour window:

* **Coded Defaults:** Pre-load high-quality JSON data for three topics:
1. **Nuclear Energy** (Climate vs. Safety).
2. **Remote Work** (Productivity vs. Social Health).
3. **Space Exploration Funding** (Innovation vs. Domestic Need).


* **Skeleton Loaders:** Display generic node structures immediately upon search to mask API latency.

---

### 7. 10-Hour Implementation Roadmap

| Hour | Focus | Action Item |
| --- | --- | --- |
| **1-2** | **UI Core** | Initialize React Flow and build the fixed 7-node graph structure. |
| **3-4** | **AI Logic** | Create the Gemini prompt to return structured JSON with detailed summaries. |
| **5-6** | **Tracing** | Integrate Arize Phoenix to capture the reasoning for bias categorization.

 |
| **7-8** | **Integration** | Map the AI JSON response to the React Flow node states. |
| **9-10** | **Polish** | Add the common-ground logic, legal disclaimer, and record the demo. |

---

### 8. Success Criteria

* The graph renders 5–7 nodes within 3 seconds of search.
* Sidebar displays detailed bullet points that provide a clear understanding of the article.
* Arize Phoenix successfully captures and displays a trace for the bias classification.