import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subcategories: [
    {
      name: {
        type: String,
        required: true,
      },
      subsubcategories: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
});

export default mongoose.model("Category", categorySchema);

/*
Add sub example
const clothingCategory = await Category.findOne({ name: 'Clothing' });

delete sub example
const subcategoryIndex = clothingCategory.subcategories.indexOf("Pants");
if (subcategoryIndex > -1) {
  clothingCategory.subcategories.splice(subcategoryIndex, 1);
}

Update sub example
const subcategoryIndex = clothingCategory.subcategories.indexOf("Shirts");
if (subcategoryIndex > -1) {
  clothingCategory.subcategories[subcategoryIndex] = "Tops";
}

.....await clothingCategory.save();

  */
