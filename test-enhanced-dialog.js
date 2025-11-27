// Quick test to verify the enhanced dialog is working
// Copy and paste this into your browser console when on the admin page

console.log('🧪 Testing Enhanced Dialog Detection');

// Check if the enhanced dialog elements exist
const createButton = Array.from(document.querySelectorAll('button')).find(btn => 
  btn.textContent.includes('Create New Task') || 
  btn.textContent.includes('Create Task') ||
  btn.textContent.includes('Create')
);

if (createButton) {
  console.log('✅ Create button found:', createButton.textContent);
  
  // Simulate click to open dialog
  createButton.click();
  
  setTimeout(() => {
    // Check for enhanced dialog elements
    const categoryCards = document.querySelectorAll('[class*="border-2"][class*="rounded-xl"]');
    const sparklesIcon = document.querySelector('[class*="w-12"][class*="h-12"]');
    const dataAnnotationCard = Array.from(document.querySelectorAll('*')).find(el => 
      el.textContent && el.textContent.includes('Data Annotation')
    );
    
    console.log('📋 Dialog analysis:');
    console.log('  - Category cards found:', categoryCards.length);
    console.log('  - Sparkles icon found:', !!sparklesIcon);
    console.log('  - Data Annotation card found:', !!dataAnnotationCard);
    
    if (categoryCards.length > 0) {
      console.log('✅ Enhanced dialog detected!');
      console.log('📝 Next steps:');
      console.log('  1. Click on "Data Annotation" card');
      console.log('  2. Fill basic info in step 2');
      console.log('  3. Look for "Dataset URL/Source" field in step 3');
    } else {
      console.log('❌ Old dialog detected or dialog not found');
      console.log('💡 Try hard refresh (Ctrl+F5) to get the latest version');
    }
  }, 1000);
} else {
  console.log('❌ Create button not found');
  console.log('💡 Make sure you are on the Admin Tasks page');
}