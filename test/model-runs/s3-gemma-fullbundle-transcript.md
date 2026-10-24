<!-- model=gemma4:12b-it-qat num_ctx=65536 system=start-from-here.prompt.md -->


<!-- USER TURN 1: I want to build a recipe sharing app, help me start  -->
<!-- prompt_eval=32771 eval=816 secs=104 done_reason=stop -->

To start building your recipe sharing app, we need to move from a "concept" to a "technical blueprint." Because you are using a structured engineering approach, we won't start coding immediately. Instead, we will follow the sequence of the documents you provided.

Here is the step-by-step plan to get your project off the ground:

### Phase 1: Discovery & Requirements (The "What")
Before we can build, we need to define the boundaries. We need to create/fill out the **PRD (Product Requirements Document)**. 

**Action Items for you to answer:**
1.  **Core Audience:** Is this for home cooks (social), professional chefs (technical), or just a personal digital cookbook?
2.  **Must-Have Features (The "Musts"):** 
    *   *Example:* User accounts, ability to create/edit/delete recipes, image uploads, and a search bar.
3.  **Key Journeys:** Describe the "Happy Path." 
    *   *Example:* A user signs up $\rightarrow$ searches for "Pasta" $\rightarrow$ finds a recipe $\rightarrow$ clicks "Save" $\rightarrow$ views it in their personal collection.
4.  **Platform:** Is this a Web app (browser), a Mobile app (iOS/Android), or a CLI tool?

---

### Phase 2: Architecture & Technical Specs (The "How")
Once we have the PRD, we will generate the following documents in order:

1.  **ARCHITECTURE.md:** We will decide on the stack (e.g., Next.js/Supabase, Python/FastAPI/PostgreSQL, or Mobile/Firebase). We'll map out how the frontend talks to the backend and where the images are stored.
2.  **DATABASE.md:** We will define the schema. 
    *   *Entities:* `Users`, `Recipes`, `Ingredients`, `Categories`, `Comments/Likes`.
3.  **TRD.md (Technical Requirements):** We will define the "Non-Functionals."
    *   *Example:* "Recipes must load in under 2 seconds (NFR-01)." "Images must be resized automatically to save bandwidth."
4.  **SECURITY_ARCHITECTURE.md:** We will define how to protect user data, handle image uploads safely, and prevent "IDOR" (e.g., making sure User A can't edit User B's recipe).

---

### Phase 3: The Implementation Plan (The "When")
After the architecture is set, we will generate the **IMPLEMENTATION_PLAN.md**. This is where we break the work into **Milestones**:

*   **M0 (Foundations):** Repo setup, CI/CD, Linting, and basic "Hello World" deployment.
*   **M1 (Data & Auth):** Setting up the database, migrations, and User Sign-up/Login.
*   **M2 (First Vertical Slice):** The "Minimum Viable Product." A user can create one recipe and see it on a list. **(This is our first goal).**
*   **M3+ (Core Features):** Search, filtering, social features, and image optimization.

---

### How we start right now:
To begin, please provide a brief description of your vision. You can just "brain dump" your ideas, and I will help you organize them into the **PRD**.

**Tell me:**
1. What is the **one thing** this app must do perfectly for a user to find it useful?
2. Who is the **primary user**?
3. Do you have a **preferred tech stack** (e.g., "I know Javascript" or "I want to use Python"), or should I recommend one based on the requirements?