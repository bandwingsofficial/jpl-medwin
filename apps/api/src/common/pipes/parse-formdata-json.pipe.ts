import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseFormDataJsonPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('\n================ PIPE START ================');

    console.log('📥 Incoming BODY TYPE:', typeof value);

    try {
      console.log('📥 Incoming BODY RAW:', JSON.stringify(value, null, 2));
    } catch {
      console.log('⚠️ Could not stringify incoming body');
    }

    if (!value || typeof value !== 'object') {
      console.log('⛔ Not an object, skipping parsing');
      return value;
    }

    const keysToParse = [
      'specifications',
      'faq',
      'variants',
      'features',
      'tags',
      'displayNotes',
      'packing',
      'directionOfUse',
      'additionalInfo',
    ];

    for (const key of keysToParse) {
      const val = value[key];

      console.log(`\n🔵 PROCESSING KEY: ${key}`);
      console.log('   ➤ EXISTS:', key in value);
      console.log('   ➤ VALUE:', val);
      console.log('   ➤ TYPE:', typeof val);
      console.log('   ➤ IS ARRAY:', Array.isArray(val));

      // ✅ Case 1: whole JSON string
      if (typeof val === 'string') {
        console.log('   🟡 Detected STRING → trying JSON.parse');

        try {
          const parsed = JSON.parse(val);
          value[key] = parsed;

          console.log('   ✅ Parsed successfully');
          console.log('   ➤ RESULT TYPE:', typeof parsed);
          console.log('   ➤ IS ARRAY:', Array.isArray(parsed));
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.log('❌ JSON.parse FAILED:', err.message);
          } else {
            console.log('❌ JSON.parse FAILED:', err);
          }
        }
      }

      // 🔥 Case 2: array of JSON strings
      else if (Array.isArray(val)) {
        console.log('   🟣 Detected ARRAY');

        value[key] = val.map((item, index) => {
          console.log(`      ➤ ITEM[${index}] TYPE:`, typeof item);
          console.log(`      ➤ ITEM[${index}] VALUE:`, item);

          if (typeof item === 'string') {
            try {
              const parsed = JSON.parse(item);
              console.log(`      ✅ ITEM[${index}] parsed`);
              return parsed;
            } catch (err) {
              console.log(`      ❌ ITEM[${index}] parse FAILED`);
              return item;
            }
          }

          return item;
        });

        console.log('   🔄 ARRAY AFTER PARSE:', value[key]);
      }

      console.log('   ✅ FINAL VALUE:', value[key]);
    }

    console.log('\n🟢 FINAL BODY AFTER PIPE:');
    try {
      console.log(JSON.stringify(value, null, 2));
    } catch {
      console.log('⚠️ Could not stringify final body');
    }

    console.log('================ PIPE END ================\n');

    return value;
  }
}
