// Quick Task Creation Script - Run this in browser console
// This bypasses the form and creates the task directly with all required fields

const createFoodClassificationTask = async () => {
  // Get auth token
  const inferaSession = localStorage.getItem('infera_session');
  if (!inferaSession) {
    console.error('❌ No session found. Please log in.');
    return;
  }
  
  const session = JSON.parse(inferaSession);
  const token = session.accessToken;
  
  if (!token) {
    console.error('❌ No access token found.');
    return;
  }

  // Complete task payload with all required fields
  const taskPayload = {
    title: 'Food Classification - Restaurant Menu Images',
    description: 'Classify high-quality food images into specific categories for a restaurant recommendation system. Workers will categorize images of dishes to help build an AI model that can automatically identify food types from restaurant photos.',
    instructions: `Step-by-step instructions for workers:
1. Look at each food image carefully
2. Identify the MAIN dish/food item (ignore sides unless specified)  
3. Select the most appropriate category from the provided list
4. If multiple foods are present, choose the dominant/primary item
5. If unsure, select "Other" and add a note
6. Ensure image quality is good enough for classification
7. Flag any inappropriate or unclear images`,
    type: 'data-annotation',
    category: 'DATA_ANNOTATION',
    
    // Content fields
    annotationType: 'image_classification',
    datasetUrl: 'https://unsplash.com/s/photos/food',
    sampleData: `Example images you'll be classifying:
1. Pizza margherita with melted mozzarella
2. Grilled salmon with vegetables 
3. Chocolate cake with berries
4. Caesar salad with croutons
5. Beef burger with fries

Each image should be clearly labeled with the primary food category visible.`,
    annotationGuidelines: `Instructions for Workers:
1. Look at each food image carefully
2. Identify the MAIN dish/food item (ignore sides unless specified)
3. Select the most appropriate category from the provided list
4. If multiple foods are present, choose the dominant/primary item
5. If unsure, select "Other" and add a note
6. Ensure image quality is good enough for classification
7. Flag any inappropriate or unclear images`,
    categories: ['pizza', 'burger', 'salad', 'pasta', 'seafood', 'dessert', 'soup', 'sandwich', 'meat', 'vegetarian', 'other'],
    
    // Requirements
    qualityMetrics: ['accuracy', 'consistency', 'completeness'],
    requirements: ['High accuracy in food identification', 'Consistent labeling across similar items', 'Complete annotation of all visible food items'],
    deliverables: ['Classified food images with category labels', 'Quality metrics report', 'Edge case documentation'],
    
    // Payment & Timeline
    estimatedHours: 2,
    hourlyRate: 15,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium'
  };

  console.log('🚀 Creating task with payload:', taskPayload);

  try {
    const response = await fetch('https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskPayload)
    });

    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Task created successfully!');
      console.log('📋 Response:', result);
      alert('✅ Food Classification task created successfully!');
      
      // Refresh the page to see the new task
      window.location.reload();
    } else {
      console.error('❌ Task creation failed:', response.status, result);
      alert(`❌ Task creation failed: ${response.status} - ${result}`);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    alert(`❌ Network error: ${error.message}`);
  }
};

// Run the task creation
createFoodClassificationTask();