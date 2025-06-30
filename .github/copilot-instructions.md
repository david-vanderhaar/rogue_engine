---
applyTo: "**"
---
# Project general coding standards   

## PRIME DIRECTIVE
	Avoid working on more than one file at a time.
    Simple code is better than complex code.
    Break down logic, functions, classes into small, manageable pieces.
    One component per file is preferred.
    Always prioritize readability and maintainability.

## LARGE FILE & COMPLEX CHANGE PROTOCOL

### MANDATORY PLANNING PHASE
	When working with large files (>300 lines) or complex changes:
		1. ALWAYS start by creating a detailed plan BEFORE making any edits
            2. Your plan MUST include:
                   - All functions/sections that need modification
                   - The order in which changes should be applied
                   - Dependencies between changes
                   - Estimated number of separate edits required
                
            3. Format your plan as:
## PROPOSED EDIT PLAN
	Working with: [filename]
	Total planned edits: [number]

### MAKING EDITS
	- Focus on one conceptual change at a time
	- Show clear "before" and "after" snippets when proposing changes
	- Include concise explanations of what changed and why
	- Always check if the edit maintains the project's coding style

### Edit sequence:
	1. [First specific change] - Purpose: [why]
	2. [Second specific change] - Purpose: [why]
	3. Do you approve this plan? I'll proceed with Edit [number] after your confirmation.
	4. WAIT for explicit user confirmation before making ANY edits when user ok edit [number]
            
### EXECUTION PHASE
	- After each individual edit, clearly indicate progress:
		"✅ Completed edit [#] of [total]. Ready for next edit?"
	- If you discover additional needed changes during editing:
	- STOP and update the plan
	- Get approval before continuing
                
### REFACTORING GUIDANCE
	When refactoring large files:
	- Break work into logical, independently functional chunks
	- Ensure each intermediate state maintains functionality
	- Consider temporary duplication as a valid interim step
	- Always indicate the refactoring pattern being applied
                
### RATE LIMIT AVOIDANCE
	- For very large files, suggest splitting changes across multiple sessions
	- Prioritize changes that are logically complete units
	- Always provide clear stopping points
            
## Javascript
	- Use `const` for constants and `let` for variables that will change.
	- Prefer arrow functions for anonymous functions.
	- Use template literals for string concatenation.
	- Always use semicolons to terminate statements.
	- Use `===` and `!==` for equality checks to avoid type coercion issues.
	- Use descriptive variable and function names.
	- use nullish coalescing operator `??` for default values.
	- Use safe navigation operator `?.` to avoid errors when accessing properties of potentially undefined objects.
	- Use destructuring assignment for objects and arrays to improve readability.
	- Use `async/await` for asynchronous code instead of callbacks or `.then()` chains.