// Function to shuffle an array
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Function to fetch categories from the API
async function fetchCategories() {
  try {
    const response = await axios.get('https://jservice.io/api/categories', {
      params: {
        count: 6, // Specify the number of categories you want to fetch
      },
    });

    const categories = response.data;
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Function to fetch clues for a given category
async function fetchClues(categoryId) {
  try {
    const response = await axios.get('https://jservice.io/api/clues', {
      params: {
        category: categoryId,
        count: 2, // Specify the number of clues you want to fetch for each category
      },
    });

    const clues = response.data;
    return clues;
  } catch (error) {
    console.error('Error fetching clues:', error);
    return [];
  }
}

// Function to initialize the game
async function initializeGame() {
  const categories = await fetchCategories();
  const shuffledCategories = shuffle(categories).slice(0, 6); // Shuffle and select 6 categories

  // Generate the category row in the HTML table
  const categoryRow = document.getElementById('category-row');
  categoryRow.innerHTML = categories
    .map((category) => `<th>${category.title}</th>`)
    .join('');

  // Fetch clues for each category and populate the clue cells
  for (let j = 0; j < shuffledCategories.length; j++) {
    const category = shuffledCategories[j];
    const clues = await fetchClues(category.id);

    const clueCells = document.querySelectorAll('.clue-cell');
    for (let i = 0; i < clues.length; i++) {
      const clue = clues[i];
      const clueCell = clueCells[j * 5 + i];

      if (clueCell) {
        clueCell.dataset.question = clue.question;
        clueCell.dataset.answer = clue.answer;
      }
    }
  }

  // Reset game state and event listeners
  resetGame();

  // Show the start button and hide the spinner
  document.getElementById('start').style.display = 'block';
  document.getElementById('spin-container').style.display = 'none';
}

// Reset game state and event listeners
function resetGame() {
  const clueCells = document.querySelectorAll('.clue-cell');
  clueCells.forEach((clueCell) => {
    clueCell.classList.remove('flipped');
    clueCell.removeEventListener('click', handleClick);
    clueCell.addEventListener('click', handleClick);
  });

  document.getElementById('score').textContent = 'Score: 0';
}

// Handle click event on clue cells
function handleClick(event) {
  const clueCell = event.target;

  if (clueCell.classList.contains('flipped')) {
    // Already flipped, show the answer
    clueCell.textContent = clueCell.dataset.answer;
    clueCell.style.color = 'red';
  } else {
    // Flip the clue cell and show the question
    clueCell.classList.add('flipped');
    clueCell.textContent = clueCell.dataset.question;
  }
}

// Function to handle game over
function handleGameOver() {
  // Disable click event on clue cells
  const clueCells = document.querySelectorAll('.clue-cell');
  clueCells.forEach((clueCell) => {
    clueCell.removeEventListener('click', handleClick);
  });

  // Show the restart button
  document.getElementById('restart').style.display = 'block';
}

// Function to start the game
function startGame() {
  // Hide the start button and show the spinner
  document.getElementById('start').style.display = 'none';
  document.getElementById('spin-container').style.display = 'block';

  // Initialize the game
  initializeGame();

  // Simulate a delay to show the spinner
  setTimeout(() => {
    // Hide the spinner and display the clue cells
    document.getElementById('spin-container').style.display = 'none';
    document.getElementById('jeopardy').style.display = 'block';
  }, 2000); // Change the delay duration as needed
}

// Function to restart the game
function restartGame() {
  // Hide the restart button and reset the score
  document.getElementById('restart').style.display = 'none';
  document.getElementById('score').textContent = 'Score: 0';

  // Clear the clue cells
  const clueTableBody = document.getElementById('clue-table-body');
  clueTableBody.innerHTML = '';

  // Initialize the game
  initializeGame();
}

// Event listener for the start button
document.getElementById('start').addEventListener('click', startGame);

// Event listener for the restart button
document.getElementById('restart').addEventListener('click', restartGame);

// Initialize the game on page load
initializeGame();
