# TheBigPicture 🌐

**Map Complexity. Find Common Ground.**

TheBigPicture is an interactive perspective mapping tool that helps users navigate polarized topics through structured, visual knowledge graphs. Instead of being overwhelmed by algorithmic feeds, users can see where viewpoints overlap, diverge, and align on core facts.

[**Demo Video**](#) | [**Live Site**](#) | [**Project Pitch**](#)

---

## 💡 Inspiration
Modern news consumption reinforces polarization. Readers are often shown what to think, but they are rarely helped to understand how different perspectives relate to one another. We built TheBigPicture to help students and self-learners step back and see the whole board by mapping complexity into clarity.

## 🚀 What it Does
When a user searches for a topic, the app dynamically generates a structured universe of information:
* **Interactive Knowledge Graph:** A central topic node branches into meaningful sub-dimensions.
* **Political Spectrum Color Coding:** Articles are classified across a 5-point spectrum to surface bias transparently.
* **Context Sidebar:** Provides instant summaries and political leaning classifications.
* **Compare Mode:** A core feature that analyzes two articles to identify shared facts, differing frames, and elusive common ground.

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Graph Engine** | React Flow |
| **Backend** | Next.js API Routes |
| **AI/LLM** | Gemini 2.5 Flash (Structured JSON output) |

## 🧠 Technical Challenges
* **Dynamic Graph Layout:** We developed a circular layout algorithm to prevent cluttered connections. This ensures the graph remains readable as complexity increases.
* **Hybrid Article Generation:** We implemented a robust fallback system to keep the UI functional even if specific API sources or AI generations experience latency.
* **State Synchronization:** Managing complex state between the search input, the visual graph nodes, and the comparison sidebar was critical for a fluid user experience.

## ⚙️ Setup & Installation

### Prerequisites
* Node.js (latest stable version)
* Gemini API Key

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/TheBigPicture.git](https://github.com/yourusername/TheBigPicture.git)
    cd TheBigPicture
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the result.

## 📈 Lessons Learned
We discovered that polarization often is not about a disagreement on facts. Instead, it is a difference in framing and emphasis. By building the Compare feature, we saw firsthand how often sources align on core information even when their narratives differ. We also learned the importance of constraining AI outputs to structured JSON to maintain the integrity of the user interface.

## 🔮 What's Next?
* **Deepened Analysis:** Expanding the Compare feature to explicitly analyze evidence versus claims.
* **Persistence:** Allowing users to save their Perspective Maps to their profile.
* **Exporting:** Adding PDF or Image exports for students to use in research or presentations.

---

### Team
* **Ishan Voleti** – Computer Engineering @ Georgia Tech
* **Aadhavan Raja** – Computer Science @ Georgia Tech
* **Taran Govindu** – Aerospace Engineering @ Georgia Tech
