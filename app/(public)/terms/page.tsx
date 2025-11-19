import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The Terms of Service Page for ScribeVerse.",
};

export default function TermsOfServicePage() {
  return (
    <section className="mx-auto max-w-2xl space-y-2 px-4">
      <h1 className="text-3xl font-bold text-primary">Terms of Service</h1>
      <p>
        THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
        THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
        OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
        ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
        OTHER DEALINGS IN THE SOFTWARE.
      </p>
    </section>
  );
}
